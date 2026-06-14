"use client";

import { useState, useTransition } from "react";
import { updateProductCodeSettingAction } from "@/app/actions/productCodeSetting.actions";
import { PlatformMarginProps } from "@/core/domain/entities/PlatformMargin";
import { ProductCodeSettingProps } from "@/core/domain/entities/ProductCodeSetting";

interface EditProductCodeSettingModalProps {
  margins: PlatformMarginProps[];
  setting: ProductCodeSettingProps;
}

export default function EditProductCodeSettingModal({ margins, setting }: EditProductCodeSettingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Extract unique platform names
  const uniquePlatforms = Array.from(new Set(margins.map(m => m.platformName))).filter(Boolean);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("id", setting.id as string);
    
    startTransition(async () => {
      const result = await updateProductCodeSettingAction(formData);
      if (result.success) {
        setIsOpen(false);
      } else {
        alert(`저장 실패: ${result.error}`);
      }
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 text-xs font-medium bg-surface-container-high text-on-surface rounded hover:bg-surface-container-highest transition-colors"
      >
        수정
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-[500px] rounded-xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface">
          <h2 className="text-lg font-bold text-on-surface">상품코드설정 수정</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-full hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[60vh] text-left">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">플랫폼</label>
              <select name="platformName" required defaultValue={setting.platformName} className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full">
                <option value="">플랫폼을 선택하세요</option>
                {uniquePlatforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">공급상품명구분자1</label>
              <input type="text" name="supplierNameDelimiter1" defaultValue={setting.supplierNameDelimiter1} required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="[" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">공급상품명구분자2</label>
              <input type="text" name="supplierNameDelimiter2" defaultValue={setting.supplierNameDelimiter2} required className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="]" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">가격정보구분자</label>
              <input type="text" name="priceInfoDelimiter" defaultValue={setting.priceInfoDelimiter} className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full" placeholder="-" />
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high rounded-md transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-md shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
