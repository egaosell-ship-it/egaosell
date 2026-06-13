"use client";

import { useState, useEffect, useActionState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/common/Button";
import { createPlatformMarginAction } from "@/app/actions/platformMargin.actions";
import { BusinessProps } from "@/core/domain/entities/Business";

interface Props {
  businesses: BusinessProps[];
}

export default function AddPlatformMarginModal({ businesses }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [state, formAction, isPending] = useActionState(createPlatformMarginAction, null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state) {
      if (state.success) {
        alert("저장되었습니다.");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsOpen(false);
      } else {
        alert("저장되지 않았습니다.\n" + (state.message || ""));
      }
    }
  }, [state]);

  const modalContent = isOpen ? (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-[90vw] sm:w-[450px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface shrink-0">
          <h3 className="text-lg font-bold text-on-surface whitespace-nowrap">새 플랫폼 마진 세팅</h3>
          <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center rounded-full p-1 hover:bg-error/10">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body Form */}
        <form action={formAction} className="flex flex-col overflow-hidden h-full">
          <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[65vh]">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">상호</label>
              <select name="businessId" required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full cursor-pointer">
                <option value="">사업자를 선택해주세요</option>
                {businesses.map((biz) => (
                  <option key={biz.id} value={biz.id}>
                    {biz.companyName} {biz.isMain && "(★)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">플랫폼</label>
              <input type="text" name="platformName" required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="예: 쿠팡, 네이버 스마트스토어" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">구분컬러</label>
              <div className="flex items-center gap-2">
                <input type="color" name="colorCode" defaultValue="#E2E8F0" className="w-10 h-10 border-0 p-0 rounded cursor-pointer bg-transparent" />
                <span className="text-xs text-on-surface-variant">플랫폼을 구분할 색상을 선택하세요</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">수수료 (%)</label>
              <input type="number" step="0.01" name="commissionRate" required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="예: 10.5" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">배송비 (원)</label>
              <input type="number" name="shippingFee" required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="예: 3000" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">기타비용 (광고비, 고정비, 세금 등 - 원)</label>
              <input type="number" name="otherCosts" required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="예: 500" />
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-2 bg-surface-container-low shrink-0">
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className="px-4 py-2 rounded text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container-lowest active:scale-95 transition-all whitespace-nowrap disabled:opacity-50 cursor-pointer"
            >
              취소
            </button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Button icon="add" onClick={() => setIsOpen(true)}>새플랫폼</Button>
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
