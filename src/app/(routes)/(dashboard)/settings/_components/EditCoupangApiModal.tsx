"use client";

import { useState, useEffect, useActionState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/common/Button";
import { updateCoupangApiAction } from "@/app/actions/coupangApi.actions";
import { BusinessProps } from "@/core/domain/entities/Business";
import { CoupangApiProps } from "@/core/domain/entities/CoupangApi";

interface Props {
  api: CoupangApiProps;
  businesses: BusinessProps[];
  onClose: () => void;
}

export default function EditCoupangApiModal({ api, businesses, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [state, formAction, isPending] = useActionState(updateCoupangApiAction, null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state) {
      if (state.success) {
        alert("수정되었습니다.");
        onClose();
      } else {
        alert("수정되지 않았습니다.\n" + (state.message || ""));
      }
    }
  }, [state, onClose]);

  const defaultExpireDate = api.expireDate 
    ? new Date(api.expireDate).toISOString().split("T")[0] 
    : "";

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-[90vw] sm:w-[450px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface shrink-0">
          <h3 className="text-lg font-bold text-on-surface whitespace-nowrap">쿠팡API 수정</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center rounded-full p-1 hover:bg-error/10">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form action={formAction} className="flex flex-col overflow-hidden h-full">
          <input type="hidden" name="id" value={api.id} />
          <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[65vh]">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">사용목적</label>
              <input type="text" name="purpose" defaultValue={api.purpose} required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">사업자명</label>
              <select name="businessId" defaultValue={api.businessId} required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full cursor-pointer">
                <option value="">사업자를 선택해주세요</option>
                {businesses.map((biz) => (
                  <option key={biz.id} value={biz.id}>
                    {biz.companyName} {biz.isMain && "(★)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">업체코드</label>
              <input type="text" name="vendorCode" defaultValue={api.vendorCode} required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">Access Key</label>
              <input type="text" name="accessKey" defaultValue={api.accessKey} required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">Secret Key</label>
              <input type="text" name="secretKey" defaultValue={api.secretKey} required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">유효기간</label>
              <input type="date" name="expireDate" defaultValue={defaultExpireDate} className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-2 bg-surface-container-low shrink-0">
            <button 
              type="button"
              onClick={onClose}
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
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
