"use client";

import { useTransition, useState } from "react";
import { deleteBusinessAction } from "@/app/actions/business.actions";
import { BusinessProps } from "@/core/domain/entities/Business";
import EditBusinessModal from "./EditBusinessModal";

interface Props {
  business: BusinessProps;
}

export default function BusinessActionButtons({ business }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = () => {
    if (window.confirm("정말로 이 사업자 정보를 삭제하시겠습니까?")) {
      startTransition(async () => {
        const result = await deleteBusinessAction(business.id!);
        if (result.success) {
          alert(result.message);
        } else {
          alert(result.message);
        }
      });
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
        <EditBusinessModal 
          business={business} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </>
  );
}
