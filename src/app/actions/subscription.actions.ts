"use server";

import { createClient } from "@/infrastructure/config/supabase/server";

export async function activateSubscription() {
  try {
    const supabase = await createClient();

    // 1. 현재 사용자 세션 확인
    const { data: { user } } = await supabase.auth.getUser();
    
    let userId = user?.id;

    // 2. 만약 로그인이 안 되어 있다면 (테스트 시뮬레이션 환경), 더미 계정으로 자동 로그인/가입
    if (!userId) {
      const dummyEmail = "test@sellersuite.kr";
      const dummyPassword = "password123!";
      
      let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: dummyEmail,
        password: dummyPassword,
      });
      
      if (signInError || !signInData.user) {
        // 가입이 안되어 있다면 signUp
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: dummyEmail,
          password: dummyPassword,
          options: {
            data: { name: "테스트 유저" }
          }
        });
        
        if (signUpError) {
          console.error("Sign up error:", signUpError);
          return { success: false, error: signUpError.message };
        }
        userId = signUpData.user?.id;
      } else {
        userId = signInData.user.id;
      }
    }

    if (!userId) {
      return { success: false, error: "사용자를 확인할 수 없습니다." };
    }

    // 3. subscriptions 테이블에 구독 권한 갱신
    // user_id로 기존 구독 정보가 있는지 확인
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingSub) {
      // 기존 내역이 있으면 업데이트
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          plan_type: 'Pro',
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq("id", existingSub.id);

      if (updateError) throw updateError;
    } else {
      // 신규 인서트
      const { error: insertError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan_type: 'Pro',
          status: 'active',
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1년 뒤 만료
        });
        
      if (insertError) throw insertError;
    }

    return { success: true };
  } catch (err: any) {
    console.error("activateSubscription Error:", err);
    return { success: false, error: err.message };
  }
}
