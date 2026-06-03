"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { issueBillingKeyAndPay } from "@/app/actions/billing.actions";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const customerKey = searchParams.get("customerKey");
  const authKey = searchParams.get("authKey");

  const [timeLeft, setTimeLeft] = useState(30);
  const [isActivating, setIsActivating] = useState(true);
  const [orderInfo, setOrderInfo] = useState<{ orderId?: string; amount?: number; error?: string } | null>(null);

  useEffect(() => {
    // 결제 성공 시 서버 액션을 호출하여 빌링키 발급 및 최초 결제 수행
    async function activate() {
      if (customerKey && authKey) {
        const res = await issueBillingKeyAndPay(customerKey, authKey);
        if (res.success) {
          setOrderInfo({ orderId: res.orderId, amount: res.amount });
          setIsActivating(false);
        } else {
          setOrderInfo({ error: res.error });
          alert("정기결제 연동에 실패했습니다. 관리자에게 문의하세요.\n\n원인: " + res.error);
          setIsActivating(false);
        }
      }
    }
    activate();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, customerKey, authKey]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-6 bg-surface text-on-surface relative">
      <div className="absolute top-8 left-8">
        <button 
          onClick={() => router.push("/")}
          className="flex items-center text-secondary hover:text-primary transition-colors text-sm font-medium group"
        >
          <span className="material-symbols-outlined text-[18px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
          대시보드로 돌아가기
        </button>
      </div>

      <div className="w-[90%] md:w-full max-w-lg bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-surface-variant text-center mx-auto min-w-[320px]">
        <span className="material-symbols-outlined text-[64px] text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <h1 className="text-2xl font-bold mb-6 break-keep">정기결제 연동이 완료되었습니다</h1>
        
        <div className="text-left bg-surface-container-low p-5 rounded-lg mb-8 flex flex-col gap-4">
          {orderInfo?.error ? (
            <div className="text-error font-medium">{orderInfo.error}</div>
          ) : (
            <>
              <div>
                <span className="block text-sm text-secondary mb-1">주문번호</span>
                <span className="text-sm font-medium">{orderInfo?.orderId || "처리 중..."}</span>
              </div>
              <div>
                <span className="block text-sm text-secondary mb-1">결제금액</span>
                <span className="text-sm font-medium">{orderInfo?.amount ? Number(orderInfo.amount).toLocaleString() + "원" : "처리 중..."}</span>
              </div>
              <div>
                <span className="block text-sm text-secondary mb-1">빌링키 연동</span>
                <span className="text-sm font-mono text-secondary break-words">완료됨</span>
              </div>
            </>
          )}
        </div>

        <button 
          onClick={() => router.push("/")}
          className="w-full inline-flex justify-center items-center h-12 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors"
        >
          {timeLeft}초 후 대시보드로 이동합니다...
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
