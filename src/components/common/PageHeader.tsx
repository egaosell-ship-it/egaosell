import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 w-full">
      <div>
        <h1 className="text-headline-sm font-headline-sm text-on-surface font-bold">{title}</h1>
        {description && <p className="text-sm text-secondary mt-1">{description}</p>}
      </div>
      {children}
    </header>
  );
}
