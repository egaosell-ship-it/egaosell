'use client';

import { useState } from 'react';
import { Button } from "@/components/common/Button";
import { createNaverApiAction } from "@/app/actions/naverApi.actions";

interface AddNaverApiModalProps {
  businesses: any[];
}

export default function AddNaverApiModal({ businesses }: AddNaverApiModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await createNaverApiAction(formData);
    setIsSubmitting(false);

    if (result.success) {
      setIsOpen(false);
    } else {
      alert(result.error || '저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        API정보입력
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl p-6 w-[500px] border border-outline-variant max-w-[90vw]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-title-md font-bold text-on-surface">네이버 API 정보 추가</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            </div>
            
            <form action={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">종류 <span className="text-error">*</span></label>
                <input 
                  type="text" 
                  name="type" 
                  required 
                  defaultValue="커머스API"
                  placeholder="예: 커머스API, 검색API 등"
                  className="px-3 py-2 border border-outline-variant rounded-md bg-surface-container-lowest text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">사업자명 <span className="text-error">*</span></label>
                <select 
                  name="businessId" 
                  required
                  className="px-3 py-2 border border-outline-variant rounded-md bg-surface-container-lowest text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">사업자를 선택하세요</option>
                  {businesses.map((biz) => (
                    <option key={biz.id} value={biz.id}>
                      {biz.companyName} {biz.isMain ? '(주사업자)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">애플리케이션 ID <span className="text-error">*</span></label>
                <input 
                  type="text" 
                  name="appId" 
                  required 
                  placeholder="네이버 개발자센터 애플리케이션 ID"
                  className="px-3 py-2 border border-outline-variant rounded-md bg-surface-container-lowest text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">애플리케이션 시크릿 <span className="text-error">*</span></label>
                <input 
                  type="password" 
                  name="appSecret" 
                  required 
                  placeholder="애플리케이션 시크릿"
                  className="px-3 py-2 border border-outline-variant rounded-md bg-surface-container-lowest text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">API호출 IP</label>
                <input 
                  type="text" 
                  name="apiIp" 
                  placeholder="예: 192.168.0.1"
                  className="px-3 py-2 border border-outline-variant rounded-md bg-surface-container-lowest text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-on-surface">인증기한</label>
                <input 
                  type="date" 
                  name="expireDate" 
                  className="px-3 py-2 border border-outline-variant rounded-md bg-surface-container-lowest text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '저장 중...' : '저장하기'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
