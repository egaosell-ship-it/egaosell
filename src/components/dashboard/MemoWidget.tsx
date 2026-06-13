"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/common/Button";

interface Memo {
  id: string;
  title: string;
  content: string;
}

export function MemoWidget() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dashboard_memos");
    if (saved) {
      try {
        setMemos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse memos");
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("dashboard_memos", JSON.stringify(memos));
    }
  }, [memos, isLoaded]);

  const addMemo = () => {
    if (memos.length >= 8) return;
    const newMemo: Memo = {
      id: Date.now().toString(),
      title: "새 메모장",
      content: "",
    };
    setMemos([...memos, newMemo]);
  };

  const updateMemoTitle = (id: string, newTitle: string) => {
    setMemos(memos.map(m => m.id === id ? { ...m, title: newTitle } : m));
  };

  const updateMemoContent = (id: string, newContent: string) => {
    setMemos(memos.map(m => m.id === id ? { ...m, content: newContent } : m));
  };

  const deleteMemo = (id: string) => {
    setMemos(memos.filter(m => m.id !== id));
  };

  return (
    <div className="w-full flex flex-col gap-2 min-w-[280px]">
      {memos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full">
          {memos.map(memo => (
            <MemoItem 
              key={memo.id} 
              memo={memo} 
              onUpdateTitle={updateMemoTitle} 
              onUpdateContent={updateMemoContent} 
              onDelete={deleteMemo}
            />
          ))}
        </div>
      )}
      
      {memos.length < 8 && (
        <div className="flex justify-end mt-1">
          <Button onClick={addMemo} icon="add">
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
  memo: Memo; 
  onUpdateTitle: (id: string, title: string) => void; 
  onUpdateContent: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(memo.title);

  const handleTitleSubmit = () => {
    if (tempTitle.trim() === "") {
      setTempTitle("새 메모장");
      onUpdateTitle(memo.id, "새 메모장");
    } else {
      onUpdateTitle(memo.id, tempTitle);
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded p-2 flex flex-col gap-1.5 relative group shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={() => onDelete(memo.id)}
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
        className="text-xs text-on-surface bg-transparent resize-none outline-none border border-transparent focus:border-outline-variant rounded p-1 h-20 w-full"
        placeholder="내용을 입력하세요..."
        value={memo.content}
        onChange={(e) => onUpdateContent(memo.id, e.target.value)}
      />
    </div>
  );
}
