"use client";

import { useState, useOptimistic, useTransition, useEffect } from "react";
import { Button } from "@/components/common/Button";
import { createMemoAction, updateMemoAction, deleteMemoAction } from "@/app/actions/memo.actions";

export interface MemoData {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface MemoWidgetProps {
  initialMemos: MemoData[];
}

export function MemoWidget({ initialMemos }: MemoWidgetProps) {
  const [memos, setMemos] = useState<MemoData[]>(initialMemos);
  const [isPending, startTransition] = useTransition();

  // initialMemos가 변경되면 memos 상태 업데이트
  useEffect(() => {
    setMemos(initialMemos);
  }, [initialMemos]);

  const [optimisticMemos, addOptimisticMemo] = useOptimistic(
    memos,
    (state: MemoData[], newMemo: { action: "add" | "update" | "delete"; memo: MemoData }) => {
      switch (newMemo.action) {
        case "add":
          return [...state, newMemo.memo];
        case "update":
          return state.map((m) => (m.id === newMemo.memo.id ? newMemo.memo : m));
        case "delete":
          return state.filter((m) => m.id !== newMemo.memo.id);
        default:
          return state;
      }
    }
  );

  const handleAddMemo = () => {
    if (optimisticMemos.length >= 16) return;
    
    // 임시 ID (DB 생성 전)
    const tempId = `temp-${Date.now()}`;
    const newMemo = { id: tempId, title: "새 메모장", content: "", createdAt: new Date().toISOString() };
    
    startTransition(async () => {
      addOptimisticMemo({ action: "add", memo: newMemo });
      const result = await createMemoAction("새 메모장", "");
      if (result.success && result.data) {
        setMemos((prev) => [...prev, result.data as MemoData]);
      } else {
        alert("메모 추가에 실패했습니다.");
      }
    });
  };

  const handleUpdateTitle = (id: string, newTitle: string) => {
    const existingMemo = memos.find(m => m.id === id);
    if (!existingMemo) return;

    const updatedMemo = { ...existingMemo, title: newTitle };

    startTransition(async () => {
      addOptimisticMemo({ action: "update", memo: updatedMemo });
      const result = await updateMemoAction(id, newTitle, undefined);
      if (result.success && result.data) {
        setMemos((prev) => prev.map(m => m.id === id ? (result.data as MemoData) : m));
      } else {
        alert("제목 수정에 실패했습니다.");
      }
    });
  };

  const handleUpdateContent = (id: string, newContent: string) => {
    const existingMemo = memos.find(m => m.id === id);
    if (!existingMemo) return;

    const updatedMemo = { ...existingMemo, content: newContent };

    startTransition(async () => {
      addOptimisticMemo({ action: "update", memo: updatedMemo });
      const result = await updateMemoAction(id, undefined, newContent);
      if (result.success && result.data) {
        setMemos((prev) => prev.map(m => m.id === id ? (result.data as MemoData) : m));
      }
    });
  };

  const handleDeleteMemo = (id: string) => {
    const existingMemo = memos.find(m => m.id === id);
    if (!existingMemo) return;

    startTransition(async () => {
      addOptimisticMemo({ action: "delete", memo: existingMemo });
      const result = await deleteMemoAction(id);
      if (result.success) {
        setMemos((prev) => prev.filter(m => m.id !== id));
      } else {
        alert("삭제에 실패했습니다.");
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-2 min-w-[280px]">
      {optimisticMemos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full">
          {optimisticMemos.map(memo => (
            <MemoItem 
              key={memo.id} 
              memo={memo} 
              onUpdateTitle={handleUpdateTitle} 
              onUpdateContent={handleUpdateContent} 
              onDelete={handleDeleteMemo}
            />
          ))}
        </div>
      )}
      
      {optimisticMemos.length < 16 && (
        <div className="flex justify-end mt-1">
          <Button onClick={handleAddMemo} icon="add">
            메모장 추가
          </Button>
        </div>
      )}
    </div>
  );
}

function MemoItem({ 
  memo, 
  onUpdateTitle, 
  onUpdateContent,
  onDelete
}: { 
  memo: MemoData; 
  onUpdateTitle: (id: string, title: string) => void; 
  onUpdateContent: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(memo.title);

  // Debounced content update state to prevent excessive API calls
  const [localContent, setLocalContent] = useState(memo.content);

  useEffect(() => {
    setLocalContent(memo.content);
  }, [memo.content]);

  const handleTitleSubmit = () => {
    if (tempTitle.trim() === "") {
      setTempTitle("새 메모장");
      onUpdateTitle(memo.id, "새 메모장");
    } else {
      if (tempTitle !== memo.title) {
        onUpdateTitle(memo.id, tempTitle);
      }
    }
    setIsEditingTitle(false);
  };

  const handleContentBlur = () => {
    if (localContent !== memo.content) {
      onUpdateContent(memo.id, localContent);
    }
  };

  return (
    <div className={`bg-surface-container-lowest border border-outline-variant rounded p-2 flex flex-col gap-1.5 relative group shadow-sm hover:shadow-md transition-shadow ${memo.id.startsWith('temp-') ? 'opacity-70' : ''}`}>
      <button 
        onClick={() => {
          if (window.confirm("정말로 이 메모장을 삭제하시겠습니까?")) {
            onDelete(memo.id);
          }
        }}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-secondary hover:text-error"
        title="삭제"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>

      <div className="min-h-[24px] flex items-center pr-4">
        {isEditingTitle ? (
          <input
            autoFocus
            className="text-xs font-semibold bg-surface border border-outline focus:border-primary outline-none px-1 py-0.5 rounded w-full text-on-surface"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSubmit();
            }}
          />
        ) : (
          <div 
            className="text-xs font-semibold text-on-surface cursor-text px-1 py-0.5 hover:bg-surface-container-low rounded truncate flex-1"
            onClick={() => {
              setIsEditingTitle(true);
              setTempTitle(memo.title);
            }}
            title="클릭하여 제목 수정"
          >
            {memo.title}
          </div>
        )}
      </div>
      
      <textarea
        className="text-xs text-on-surface bg-transparent resize-none outline-none border border-transparent focus:border-outline-variant rounded p-1 h-[200px] w-full"
        placeholder="내용을 입력하세요..."
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        onBlur={handleContentBlur}
      />
    </div>
  );
}
