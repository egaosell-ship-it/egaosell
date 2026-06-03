import { redirect } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { createClient } from "@/infrastructure/config/supabase/server";

export default async function CrawlingPage() {
  // Supabase 클라이언트 및 현재 사용자 세션 확인
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 비로그인 상태면 업그레이드 페이지로 (결제/로그인 유도)
  if (!user) {
    redirect("/upgrade");
  }

  // subscriptions 테이블에서 현재 유저의 활성 구독 정보 조회
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  const now = new Date();
  const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
  const isActive = subscription?.status.toUpperCase() === "ACTIVE";
  const isCanceledButValid = subscription?.status.toUpperCase() === "CANCELED" && periodEnd && periodEnd > now;

  // 활성 구독이 없고, (취소 상태지만 유효한 기간)에도 해당하지 않으면 업그레이드 페이지로 리다이렉트
  if (!subscription || (!isActive && !isCanceledButValid)) {
    redirect("/upgrade");
  }
  return (
    <>
      <PageHeader 
        title="상품 수집 (크롤링)" 
        description="타 마켓플레이스의 상품 정보를 빠르게 수집합니다." 
      />
      
      <div className="mt-6 flex flex-col gap-4">
        <Panel>
          <p className="text-sm text-on-surface">준비 중인 페이지입니다.</p>
        </Panel>
      </div>
    </>
  );
}
