"use client";

import { useState, useEffect, useActionState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/common/Button";
import { createBusinessAction } from "@/app/actions/business.actions";

export default function AddBusinessModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [state, formAction, isPending] = useActionState(createBusinessAction, null);

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
          <h3 className="text-lg font-bold text-on-surface whitespace-nowrap">새 사업자 등록</h3>
          <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center rounded-full p-1 hover:bg-error/10">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body Form */}
        <form action={formAction} className="flex flex-col overflow-hidden h-full">
          <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[65vh]">
            <label className="flex items-center gap-2 text-sm font-medium text-on-surface cursor-pointer w-fit whitespace-nowrap">
              <input type="checkbox" name="isMain" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary cursor-pointer shrink-0" />
              주사업자 여부
            </label>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">상호명</label>
              <input type="text" name="companyName" required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="예: (주)이가오셀" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">사업자ID</label>
              <input type="text" name="businessId" required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="예: biz_002" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">대표자명</label>
              <input type="text" name="ceoName" required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="홍길동" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">대표전화</label>
              <input type="tel" name="phone" className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="02-1234-5678" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">사업장주소</label>
              <input type="text" name="address" className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="주소를 입력하세요" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">사업자등록번호</label>
              <input type="text" name="regNumber" className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="123-45-67890" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">통신판매업신고번호</label>
              <input type="text" name="mailOrderNumber" className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="제2026-서울강남-1234호" />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-2 bg-surface-container-low shrink-0">
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className="px-4 py-2 rounded text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container-lowest active:scale-95 transition-all whitespace-nowrap disabled:opacity-50"
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
      <Button icon="add" onClick={() => setIsOpen(true)}>새 사업자 등록</Button>
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
