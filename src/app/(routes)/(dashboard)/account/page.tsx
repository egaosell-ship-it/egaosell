import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { Button } from "@/components/common/Button";
import { createClient } from "@/infrastructure/config/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CancelSubscriptionButton } from "./_components/CancelSubscriptionButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const isSubscribed = subscription && subscription.status.toUpperCase() === "ACTIVE";
  const isCanceled = subscription && subscription.status.toUpperCase() === "CANCELED";
  const now = new Date();
  const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
  const isCanceledButValid = isCanceled && periodEnd && periodEnd > now;
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <PageHeader 
        title="내 계정 관리" 
        description="프로필 및 구독 요금제를 관리합니다." 
      />
      
      <div className="mt-6 flex flex-col gap-6 max-w-2xl">
        <Panel className="p-6">
          <h2 className="text-lg font-bold mb-6 text-on-surface">구독 정보</h2>
          
          {isSubscribed || isCanceledButValid ? (
            <div className="flex flex-col gap-6">
              {isCanceledButValid && (
                <div className="bg-error-container text-on-error-container p-3 rounded text-sm font-medium">
                  구독이 취소되었습니다. {formatDate(subscription.current_period_end)}까지는 모든 기능을 정상적으로 이용하실 수 있습니다.
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-on-surface-variant">현재 요금제</span>
                  <span className="font-medium text-lg text-on-surface">SellerSuite {subscription.plan_type}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-on-surface-variant">결제 금액</span>
                  <span className="font-medium text-lg text-on-surface">
                    {subscription.plan_type === "Pro" ? "1,188,000원 / 연" : "무료"}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm text-on-surface-variant">{isCanceledButValid ? "이용 가능일" : "다음 결제일"}</span>
                  <span className="font-medium text-lg text-on-surface">
                    {isCanceledButValid ? formatDate(subscription.current_period_end) : formatDate(subscription.next_billing_date)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm text-on-surface-variant">결제 수단</span>
                  <span className="font-medium text-lg text-on-surface flex items-center gap-2">
                    {isCanceledButValid ? "결제 수단 없음" : "토스페이먼츠"} 
                    {!isCanceledButValid && <span className="text-xs bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">자동결제</span>}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-6 border-t border-outline-variant flex gap-3">
                {isSubscribed && (
                  <>
                    <Link href="/upgrade">
                      <Button variant="primary">플랜 변경</Button>
                    </Link>
                    <CancelSubscriptionButton />
                  </>
                )}
                {isCanceledButValid && (
                  <Link href="/upgrade">
                    <Button variant="primary">다시 구독하기</Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <span className="material-symbols-outlined text-4xl text-outline mb-2" style={{ fontVariationSettings: "'FILL' 0" }}>credit_card_off</span>
              <p className="text-on-surface-variant">현재 구독 중인 요금제가 없습니다.</p>
              <Link href="/upgrade">
                <Button variant="primary" className="mt-2">플랜 알아보기</Button>
              </Link>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
