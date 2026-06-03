"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { cancelSubscription } from "@/app/actions/billing.actions";
import { useRouter } from "next/navigation";

export function CancelSubscriptionButton() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setIsLoading(true);
    const res = await cancelSubscription();
    setIsLoading(false);
    
    if (res.success) {
      alert("구독이 정상적으로 취소되었습니다. 다음 결제일 전까지는 계속 이용하실 수 있습니다.");
      setIsConfirming(false);
      router.refresh();
    } else {
      alert("구독 취소 중 오류가 발생했습니다: " + res.error);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsConfirming(true)}>
        구독 취소
      </Button>

      {isConfirming && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface p-6 rounded-lg w-[360px] max-w-[90vw] shrink-0 shadow-lg border border-outline-variant">
            <h3 className="text-lg font-bold text-on-surface mb-2">구독을 취소하시겠습니까?</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              취소하더라도 다음 결제일 전까지는 모든 기능을 정상적으로 이용하실 수 있습니다. 자동 결제에 사용되는 정보(빌링키)는 즉시 삭제됩니다.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsConfirming(false)} disabled={isLoading}>
                아니오
              </Button>
              <Button variant="primary" onClick={handleCancel} disabled={isLoading}>
                {isLoading ? "처리 중..." : "예, 취소합니다"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
