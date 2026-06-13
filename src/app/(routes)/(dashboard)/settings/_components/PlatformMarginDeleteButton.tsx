"use client";

import { useTransition } from "react";
import { deletePlatformMarginAction } from "@/app/actions/platformMargin.actions";

interface Props {
  id: string;
}

export default function PlatformMarginDeleteButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("정말로 이 플랫폼 마진 정보를 삭제하시겠습니까?")) {
      startTransition(async () => {
        const result = await deletePlatformMarginAction(id);
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
