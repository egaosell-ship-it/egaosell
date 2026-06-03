"use server";

import { createClient } from "@/infrastructure/config/supabase/server";
import { createAdminClient } from "@/infrastructure/config/supabase/admin";

// KST 기준으로 한 달 뒤 자정(00:00:00)을 계산한 후 UTC로 반환하는 헬퍼 함수
function getNextBillingDateKST(baseDateStr?: string) {
  const baseDate = baseDateStr ? new Date(baseDateStr) : new Date();
  // 1. KST 시간으로 변환 (UTC + 9시간)
  const kstDate = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  
  // 2. KST 기준 정확히 한 달 뒤 자정으로 설정
  kstDate.setUTCMonth(kstDate.getUTCMonth() + 1);
  kstDate.setUTCHours(0, 0, 0, 0);
  
  // 3. 다시 UTC로 변환하여 반환 (DB 저장을 위해)
  return new Date(kstDate.getTime() - 9 * 60 * 60 * 1000);
}

// 테스트 환경을 위한 익명 유저 생성/로그인 헬퍼 함수
async function ensureAuthenticatedUser(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return user.id;

  const dummyEmail = "test@sellersuite.kr";
  const dummyPassword = "password123!";
  
  let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: dummyEmail,
    password: dummyPassword,
  });
  
  if (signInError || !signInData.user) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: dummyEmail,
      password: dummyPassword,
      options: { data: { name: "테스트 유저" } }
    });
    
    if (signUpError) {
      console.error("Sign up error:", signUpError);
      return null;
    }
    return signUpData.user?.id;
  }
  return signInData.user.id;
}

export async function initiatePayment(amount: number, orderName: string) {
  try {
    const supabase = await createClient();
    const userId = await ensureAuthenticatedUser(supabase);
    
    if (!userId) {
      return { success: false, error: "사용자 인증에 실패했습니다." };
    }

    // PENDING 상태로 billing_history 생성
    const { data, error } = await supabase
      .from("billing_history")
      .insert({
        user_id: userId,
        amount: amount,
        description: orderName,
        status: "PENDING",
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("initiatePayment Insert Error:", error);
      return { success: false, error: "결제 내역 생성에 실패했습니다." };
    }

    return { success: true, orderId: data.id };
  } catch (err: any) {
    console.error("initiatePayment Error:", err);
    return { success: false, error: err.message };
  }
}

export async function updatePaymentStatus(orderId: string, status: "SUCCESS" | "FAILED" | "CANCELED", reason?: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "사용자 세션이 없습니다." };
    }

    // 기존 설명에 사유 덧붙이기 위해 기존 데이터 조회
    const { data: billing } = await supabase
      .from("billing_history")
      .select("description")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    let newDescription = billing?.description || "";
    if (reason) {
      newDescription += ` (사유: ${reason})`;
    }

    const { error } = await supabase
      .from("billing_history")
      .update({
        status: status,
        description: newDescription
      })
      .eq("id", orderId)
      .eq("user_id", user.id);

    if (error) {
      console.error("updatePaymentStatus Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("updatePaymentStatus Exception:", err);
    return { success: false, error: err.message };
  }
}

export async function issueBillingKeyAndPay(customerKey: string, authKey: string) {
  try {
    const supabase = await createClient();
    const userId = await ensureAuthenticatedUser(supabase);

    if (!userId) {
      return { success: false, error: "사용자 인증에 실패했습니다." };
    }

    // 1. 빌링키 발급 요청
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      throw new Error("TOSS_SECRET_KEY 환경 변수가 설정되지 않았습니다.");
    }
    const encodedAuth = Buffer.from(secretKey + ":").toString("base64");

    const issueRes = await fetch("https://api.tosspayments.com/v1/billing/authorizations/issue", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authKey,
        customerKey,
      }),
    });

    if (!issueRes.ok) {
      const errorData = await issueRes.json();
      console.error("Billing Key Issue Error:", errorData);
      return { success: false, error: errorData.message || "빌링키 발급 실패" };
    }

    const issueData = await issueRes.json();
    const billingKey = issueData.billingKey;

    // 2. 발급받은 빌링키 저장 (subscriptions 테이블)
    // KST 기준으로 정확히 한 달 뒤 자정(00:00)을 계산 (UTC 15:00 저장)
    const nextBillingDate = getNextBillingDateKST();

    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingSub) {
      const { error: updateError } = await supabase.from("subscriptions").update({
        plan_type: "Pro",
        status: "ACTIVE",
        customer_key: customerKey,
        billing_key: billingKey,
        next_billing_date: nextBillingDate.toISOString(),
        current_period_end: nextBillingDate.toISOString(),
      }).eq("id", existingSub.id);
      if (updateError) console.error("Subscription Update Error:", updateError);
    } else {
      const { error: insertError } = await supabase.from("subscriptions").insert({
        user_id: userId,
        plan_type: "Pro",
        status: "ACTIVE",
        customer_key: customerKey,
        billing_key: billingKey,
        next_billing_date: nextBillingDate.toISOString(),
        current_period_end: nextBillingDate.toISOString(),
      });
      if (insertError) console.error("Subscription Insert Error:", insertError);
    }

    // 3. 최초 결제 승인 요청 (빌링키 사용)
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const amount = 1188000;

    const payRes = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerKey,
        orderId,
        orderName: "SellerSuite Pro 플랜 (연간 정기결제)",
        amount,
        customerEmail: "hong@sellersuite.kr",
        customerName: "홍길동",
      }),
    });

    if (!payRes.ok) {
      const errorData = await payRes.json();
      console.error("Billing Payment Error:", errorData);
      return { success: false, error: errorData.message || "정기결제 승인 실패" };
    }

    const payData = await payRes.json();

    // 4. 결제 내역 저장
    const { error: historyError } = await supabase.from("billing_history").insert({
      user_id: userId,
      amount: amount,
      description: "SellerSuite Pro 플랜 (연간 정기결제)",
      status: "SUCCESS",
    });
    if (historyError) console.error("Billing History Insert Error:", historyError);

    return { success: true, orderId: payData.orderId, amount: payData.totalAmount };
  } catch (err: any) {
    console.error("issueBillingKeyAndPay Exception:", err);
    return { success: false, error: err.message };
  }
}

export async function executeDailyBillingPayments() {
  try {
    const supabaseAdmin = createAdminClient();

    // 오늘 날짜 구하기 (KST 기준)
    const now = new Date();
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const todayKST = kstNow.toISOString().split('T')[0];

    // KST 00:00:00 ~ 23:59:59 범위를 UTC로 변환하여 조회
    // KST 00:00:00은 UTC 기준 전날 15:00:00
    const startOfDayKST = new Date(todayKST + "T00:00:00.000Z");
    const startOfDayUTC = new Date(startOfDayKST.getTime() - 9 * 60 * 60 * 1000).toISOString();
    
    const endOfDayKST = new Date(todayKST + "T23:59:59.999Z");
    const endOfDayUTC = new Date(endOfDayKST.getTime() - 9 * 60 * 60 * 1000).toISOString();

    // next_billing_date가 오늘(KST) 범위에 포함되는 활성 구독 조회
    const { data: subscriptions, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .ilike('status', 'ACTIVE')
      .gte('next_billing_date', startOfDayUTC)
      .lte('next_billing_date', endOfDayUTC);

    if (error) {
      console.error("Fetch subscriptions error:", error);
      return { success: false, error: error.message };
    }

    if (!subscriptions || subscriptions.length === 0) {
      return { success: true, message: "오늘 결제할 구독 내역이 없습니다.", count: 0 };
    }

    let successCount = 0;
    let failCount = 0;

    for (const sub of subscriptions) {
      const res = await processSubscriptionPayment(sub);
      if (res.success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    return { 
      success: true, 
      message: `총 ${subscriptions.length}건 중 성공: ${successCount}건, 실패: ${failCount}건`,
      successCount,
      failCount
    };
  } catch (err: any) {
    console.error("executeDailyBillingPayments Exception:", err);
    return { success: false, error: err.message };
  }
}

export async function processSubscriptionPayment(subscription: any) {
  try {
    const supabaseAdmin = createAdminClient();
    const { id, billing_key, customer_key, user_id, plan_type, next_billing_date } = subscription;

    if (!billing_key || !customer_key) {
      return { success: false, error: "빌링키 또는 고객키가 없습니다." };
    }

    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) throw new Error("TOSS_SECRET_KEY 누락");
    const encodedAuth = Buffer.from(secretKey + ":").toString("base64");

    const orderId = `auto_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const amount = plan_type === "Pro" ? 1188000 : 1188000; // 요금제에 따른 금액 (기본값 설정)

    const payRes = await fetch(`https://api.tosspayments.com/v1/billing/${billing_key}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerKey: customer_key,
        orderId,
        orderName: `SellerSuite ${plan_type} 플랜 (자동 정기결제)`,
        amount,
      }),
    });

    if (!payRes.ok) {
      const errorData = await payRes.json();
      console.error(`Auto Payment Error for user ${user_id}:`, errorData);
      // 실패 내역 기록
      await supabaseAdmin.from("billing_history").insert({
        user_id,
        amount,
        description: `SellerSuite ${plan_type} 플랜 (자동 정기결제 실패)`,
        status: "FAILED",
      });
      return { success: false, error: errorData.message };
    }

    const payData = await payRes.json();

    // 성공 시 다음 결제일 갱신 (KST 기준 정확히 한 달 뒤 자정)
    const nextDate = getNextBillingDateKST(next_billing_date);

    await supabaseAdmin.from("subscriptions").update({
      next_billing_date: nextDate.toISOString(),
      current_period_end: nextDate.toISOString(),
    }).eq("id", id);

    // 성공 내역 기록
    await supabaseAdmin.from("billing_history").insert({
      user_id,
      amount,
      description: `SellerSuite ${plan_type} 플랜 (자동 정기결제 성공)`,
      status: "SUCCESS",
    });

    return { success: true };
  } catch (err: any) {
    console.error(`processSubscriptionPayment Exception:`, err);
    return { success: false, error: err.message };
  }
}

export async function cancelSubscription() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, error: "인증되지 않은 사용자입니다." };

    // 구독 취소 시 상태를 CANCELED로 변경하고, 자동 결제가 되지 않도록 billing_key를 삭제
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "CANCELED",
        billing_key: null
      })
      .eq("user_id", user.id);

    if (error) throw error;
    
    return { success: true };
  } catch (err: any) {
    console.error("Cancel Subscription Error:", err);
    return { success: false, error: err.message };
  }
}
