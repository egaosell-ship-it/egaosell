"use client";

import { useState } from "react";
import { deleteCoupangApiAction } from "@/app/actions/coupangApi.actions";
import EditCoupangApiModal from "./EditCoupangApiModal";
import { CoupangApiProps } from "@/core/domain/entities/CoupangApi";
import { BusinessProps } from "@/core/domain/entities/Business";

interface Props {
  api: CoupangApiProps;
  businesses: BusinessProps[];
}

export default function CoupangApiActionButtons({ api, businesses }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      if (!api.id) return;
      setIsPending(true);
      try {
        const result = await deleteCoupangApiAction(api.id);
        if (result.success) {
          alert("삭제되었습니다.");
        } else {
          alert(result.message || "삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("삭제 중 오류가 발생했습니다.");
      } finally {
        setIsPending(false);
      }
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsEditModalOpen(true)}
        className="text-primary hover:text-primary-fixed-variant text-xs font-medium mr-2 cursor-pointer disabled:cursor-not-allowed"
        disabled={isPending}
      >
        수정
      </button>
      <button 
        onClick={handleDelete}
        className="text-error hover:text-error/80 text-xs font-medium cursor-pointer disabled:cursor-not-allowed"
        disabled={isPending}
      >
        {isPending ? "삭제 중..." : "삭제"}
      </button>

      {isEditModalOpen && (
        <EditCoupangApiModal 
          api={api}
          businesses={businesses}
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </>
  );
}
