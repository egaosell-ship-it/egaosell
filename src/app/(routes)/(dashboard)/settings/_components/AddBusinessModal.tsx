"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";

export default function AddBusinessModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button icon="add" onClick={() => setIsOpen(true)}>새 사업자 등록</Button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="text-lg font-bold text-on-surface">새 사업자 등록</h3>
              <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center rounded-full p-1 hover:bg-error/10">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[65vh]">
              <label className="flex items-center gap-2 text-sm font-medium text-on-surface cursor-pointer w-fit">
                <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary cursor-pointer" />
                주사업자 여부
              </label>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">상호명</label>
                <input type="text" className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all" placeholder="예: (주)이가오셀" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">사업자ID</label>
                <input type="text" className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all" placeholder="예: biz_002" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">대표자명</label>
                <input type="text" className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all" placeholder="홍길동" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">대표전화</label>
                <input type="tel" className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all" placeholder="02-1234-5678" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">사업장주소</label>
                <input type="text" className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all" placeholder="주소를 입력하세요" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">사업자등록번호</label>
                <input type="text" className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all" placeholder="123-45-67890" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">통신판매업신고번호</label>
                <input type="text" className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all" placeholder="제2026-서울강남-1234호" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-2 bg-surface-container-low">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container-lowest active:scale-95 transition-all"
              >
                취소
              </button>
              <Button onClick={() => {
                alert("저장되었습니다.");
                setIsOpen(false);
              }}>
                저장
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
