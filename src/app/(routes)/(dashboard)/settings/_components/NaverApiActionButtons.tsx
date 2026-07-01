'use client';

import { useState } from 'react';
import { deleteNaverApiAction } from '@/app/actions/naverApi.actions';

interface NaverApiActionButtonsProps {
  api: any;
}

export default function NaverApiActionButtons({ api }: NaverApiActionButtonsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('정말 이 네이버 API 정보를 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteNaverApiAction(api.id);
    setIsDeleting(false);

    if (!result.success) {
      alert(result.error || '삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button 
        className="text-primary hover:underline text-xs"
        onClick={() => alert('수정 기능은 추후 제공될 예정입니다.')}
      >
        수정
      </button>
      <span className="text-outline-variant">|</span>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-error hover:underline text-xs disabled:opacity-50"
      >
        {isDeleting ? '삭제중' : '삭제'}
      </button>
    </div>
  );
}
