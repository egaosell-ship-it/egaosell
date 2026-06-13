"use client";

import { useState, useEffect, useActionState } from "react";
import { createPortal } from "react-dom";
import { updateBusinessAction } from "@/app/actions/business.actions";
import { BusinessProps } from "@/core/domain/entities/Business";

interface Props {
  business: BusinessProps;
  onClose: () => void;
}

export default function EditBusinessModal({ business, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [state, formAction, isPending] = useActionState(updateBusinessAction, null);

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

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-outline-variant">
          <h2 className="text-xl font-bold text-on-surface">사업자정보 수정</h2>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto">
          <form id="edit-business-form" action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={business.id} />
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="isMain" 
                defaultChecked={business.isMain}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-on-surface">주사업자여부</span>
            </label>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface">상호명 *</label>
              <input 
                type="text" 
                name="companyName" 
                required 
                defaultValue={business.companyName}
                className="w-full px-3 py-2 bg-surface-container rounded-md border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="(주)이가오셀"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface">사업자ID *</label>
              <input 
                type="text" 
                name="businessId" 
                required 
                defaultValue={business.businessId}
                className="w-full px-3 py-2 bg-surface-container rounded-md border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="biz_001"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface">대표자명 *</label>
              <input 
                type="text" 
                name="ceoName" 
                required 
                defaultValue={business.ceoName}
                className="w-full px-3 py-2 bg-surface-container rounded-md border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="홍길동"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface">대표전화</label>
              <input 
                type="text" 
                name="phone" 
                defaultValue={business.phone || ""}
                className="w-full px-3 py-2 bg-surface-container rounded-md border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="02-1234-5678"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface">사업장주소</label>
              <input 
                type="text" 
                name="address" 
                defaultValue={business.address || ""}
                className="w-full px-3 py-2 bg-surface-container rounded-md border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="서울특별시 강남구 테헤란로 123"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface">사업자등록번호</label>
              <input 
                type="text" 
                name="regNumber" 
                defaultValue={business.regNumber || ""}
                className="w-full px-3 py-2 bg-surface-container rounded-md border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="123-45-67890"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface">통신판매업신고번호</label>
              <input 
                type="text" 
                name="mailOrderNumber" 
                defaultValue={business.mailOrderNumber || ""}
                className="w-full px-3 py-2 bg-surface-container rounded-md border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="제2026-서울강남-1234호"
              />
            </div>
          </form>
        </div>

        <div className="p-4 md:p-6 border-t border-outline-variant flex items-center justify-end gap-3 bg-surface-container-low mt-auto">
          <button 
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-sm font-medium text-on-surface bg-surface-container border border-outline-variant rounded-md hover:bg-surface-container-high transition-colors"
          >
            취소
          </button>
          <button 
            type="submit"
            form="edit-business-form"
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-on-primary bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
