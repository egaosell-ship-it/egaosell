"use client";

import { useState, useEffect, useActionState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/common/Button";
import { updateOwnedStoreAction } from "@/app/actions/ownedStore.actions";
import { BusinessProps } from "@/core/domain/entities/Business";
import { PlatformMarginProps } from "@/core/domain/entities/PlatformMargin";
import { OwnedStoreProps } from "@/core/domain/entities/OwnedStore";

interface Props {
  businesses: BusinessProps[];
  margins: PlatformMarginProps[];
  store: OwnedStoreProps;
}

export default function EditOwnedStoreModal({ businesses, margins, store }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [state, formAction, isPending] = useActionState(updateOwnedStoreAction, null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(store.businessId);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state) {
      if (state.success) {
        alert("수정되었습니다.");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsOpen(false);
      } else {
        alert("수정되지 않았습니다.\n" + (state.message || ""));
      }
    }
  }, [state]);

  const availablePlatforms = margins.filter(m => m.businessId === selectedBusinessId);

  const modalContent = isOpen ? (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-[90vw] sm:w-[450px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface shrink-0">
          <h3 className="text-lg font-bold text-on-surface whitespace-nowrap">스토어 정보 수정</h3>
          <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center rounded-full p-1 hover:bg-error/10">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body Form */}
        <form action={formAction} className="flex flex-col overflow-hidden h-full">
          <input type="hidden" name="id" value={store.id} />
          <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[65vh]">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">사업자명</label>
              <select 
                name="businessId" 
                required 
                value={selectedBusinessId}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
                className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full cursor-pointer"
              >
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
              <select 
                name="platformName" 
                required 
                defaultValue={store.platformName}
                disabled={!selectedBusinessId}
                className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full cursor-pointer disabled:opacity-50 disabled:bg-surface-container"
              >
                <option value="">플랫폼을 선택해주세요</option>
                {availablePlatforms.map((plat) => (
                  <option key={plat.id} value={plat.platformName}>
                    {plat.platformName}
                  </option>
                ))}
              </select>
              {!selectedBusinessId && <span className="text-[10px] text-error">사업자를 먼저 선택해주세요.</span>}
              {selectedBusinessId && availablePlatforms.length === 0 && <span className="text-[10px] text-error">해당 사업자에 등록된 플랫폼(마진세팅)이 없습니다.</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">로그인아이디</label>
              <input type="text" name="loginId" required defaultValue={store.loginId} className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="로그인아이디를 입력하세요" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">사이트명</label>
              <input type="text" name="siteName" required defaultValue={store.siteName} className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="사이트명을 입력하세요 (예: 쿠팡윙)" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">스토어 URL</label>
              <input type="url" name="storeUrl" required defaultValue={store.storeUrl} className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="https://example.com" />
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
            <Button type="submit" disabled={isPending || (selectedBusinessId !== "" && availablePlatforms.length === 0)}>
              {isPending ? "저장 중..." : "수정"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-primary hover:text-primary-fixed-variant text-xs font-medium mr-2 cursor-pointer"
      >
        수정
      </button>
      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
