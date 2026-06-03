"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { updatePaymentStatus } from "@/app/actions/billing.actions";

function FailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (orderId && code) {
      const isCanceled = code === "PAY_PROCESS_CANCELED" || code === "PAY_PROCESS_ABORTED";
      const status = isCanceled ? "CANCELED" : "FAILED";
      const displayMsg = message || "알 수 없는 오류";
      
      updatePaymentStatus(orderId, status, displayMsg).catch(console.error);
    }
  }, [orderId, code, message]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-surface text-on-surface">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-surface-variant text-center">
        <span className="material-symbols-outlined text-[64px] text-error mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
        <h1 className="text-2xl font-bold mb-6">결제에 실패했습니다</h1>
        
        <div className="text-left bg-error-container text-on-error-container p-4 rounded-lg mb-8">
          <p className="text-sm font-bold mb-1">에러 코드: {code}</p>
          <p className="text-sm">{message}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
          onClick={() => router.push("/checkout")}
          className="w-full inline-flex justify-center items-center h-12 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors mb-3"
        >
          다시 시도하기
        </button>
        <button 
          onClick={() => router.push("/")}
          className="w-full inline-flex justify-center items-center h-12 bg-surface text-on-surface border border-outline rounded-lg font-bold hover:bg-surface-container-low transition-colors"
        >
          대시보드로 돌아가기
        </button>
        </div>
      </div>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <FailContent />
    </Suspense>
  );
}
