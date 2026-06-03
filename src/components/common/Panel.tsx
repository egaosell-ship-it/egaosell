import { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className = "" }: PanelProps) {
  return (
    <div className={`bg-surface rounded-lg border border-outline-variant p-4 ${className}`}>
      {children}
    </div>
  );
}
