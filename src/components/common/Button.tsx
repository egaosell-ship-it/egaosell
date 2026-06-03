import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  icon?: string;
  children: ReactNode;
}

export function Button({ 
  variant = "primary", 
  icon, 
  children, 
  className = "", 
  ...props 
}: ButtonProps) {
  const baseClass = "rounded px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantClass = "";
  switch (variant) {
    case "primary":
      variantClass = "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container";
      break;
    case "secondary":
      variantClass = "bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container";
      break;
    case "outline":
      variantClass = "bg-surface text-on-surface border border-outline-variant hover:bg-surface-container-low";
      break;
    case "ghost":
      variantClass = "bg-transparent text-on-surface hover:bg-surface-container-low";
      break;
  }

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {icon && (
        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}
