"use client";

import { useTransition } from "react";
import { deleteProductCodeSettingAction } from "@/app/actions/productCodeSetting.actions";

interface ProductCodeSettingDeleteButtonProps {
  id: string;
}

export default function ProductCodeSettingDeleteButton({ id }: ProductCodeSettingDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("정말 이 상품코드설정을 삭제하시겠습니까?")) {
      startTransition(async () => {
        const result = await deleteProductCodeSettingAction(id);
        if (!result.success) {
          alert(`삭제 실패: ${result.error}`);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="px-3 py-1.5 text-xs font-medium bg-error/10 text-error rounded hover:bg-error/20 transition-colors disabled:opacity-50"
    >
      {isPending ? "삭제 중..." : "삭제"}
    </button>
  );
}
