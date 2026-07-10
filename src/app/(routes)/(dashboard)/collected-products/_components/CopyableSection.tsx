'use client';

import { useState } from 'react';

interface CopyableSectionProps {
  title: string;
  content: string;
}

export function CopyableSection({ title, content }: CopyableSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm relative group">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-title-md font-title-md text-on-surface">{title}</h2>
        <button
          onClick={handleCopy}
          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-variant/50 rounded-md transition-colors"
          title="텍스트 복사"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="text-body-md text-on-surface whitespace-pre-wrap leading-relaxed">
        {content}
      </div>
    </section>
  );
}
