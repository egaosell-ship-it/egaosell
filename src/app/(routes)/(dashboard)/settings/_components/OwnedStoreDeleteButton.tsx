"use client";

import { useTransition } from "react";
import { deleteOwnedStoreAction } from "@/app/actions/ownedStore.actions";

interface Props {
  id: string;
}

export default function OwnedStoreDeleteButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("정말로 이 스토어 정보를 삭제하시겠습니까?")) {
      startTransition(async () => {
        const result = await deleteOwnedStoreAction(id);
        if (result.success) {
          alert(result.message);
        } else {
          alert(result.message);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-error hover:text-error/80 text-xs font-medium cursor-pointer disabled:cursor-not-allowed"
      disabled={isPending}
    >
      {isPending ? "삭제 중..." : "삭제"}
    </button>
  );
}
