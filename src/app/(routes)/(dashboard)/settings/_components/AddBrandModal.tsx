"use client";

import { useState, useEffect, useActionState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/common/Button";
import { createBrandAction } from "@/app/actions/brand.actions";

export default function AddBrandModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [state, formAction, isPending] = useActionState(createBrandAction, null);

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
          <h3 className="text-lg font-bold text-on-surface whitespace-nowrap">새 브랜드 등록</h3>
          <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center rounded-full p-1 hover:bg-error/10">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body Form */}
        <form action={formAction} className="flex flex-col overflow-hidden h-full">
          <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[65vh]">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">브랜드명</label>
              <input type="text" name="brandName" required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="예: 나이키" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">코드</label>
              <input type="text" name="code" required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="예: NK-001" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">카페24코드</label>
              <input type="text" name="cafe24Code" required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="예: C24-NK01" />
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
      <Button icon="add" onClick={() => setIsOpen(true)}>새브랜드</Button>
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
