'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth.actions';

export default function DashboardNav() {
  const pathname = usePathname();

  const navLinks = [
    { name: '대시보드', href: '/' },
    { name: '주문 변환', href: '/order-conversion' },
    { name: '상품 목록', href: '/products' },
    { name: '상품 수집', href: '/crawling' },
    { name: '마진 계산기', href: '/calculator' },
    { name: '커뮤니티', href: '/board' },
  ];

  return (
    <nav className="bg-surface-container-lowest w-full flex-shrink-0 h-14 border-b border-outline-variant flex items-center justify-between px-4 z-50">
      {/* Left side: Brand + Nav Links */}
      <div className="flex items-center gap-6 h-full">
        <Link href="/" className="text-headline-sm font-headline-sm font-bold text-primary active:scale-95 transition-transform duration-150">
          egaoSell
        </Link>

        <div className="flex items-center gap-2 h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center h-full px-3 border-b-2 transition-colors duration-200 text-[11px] font-medium ${
                  isActive
                    ? 'border-primary text-primary-fixed-variant'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right side: Search, Account, Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-surface-container-low border border-outline-variant rounded px-2 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all w-60">
          <span className="material-symbols-outlined text-outline text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
          <input
            className="bg-transparent border-none focus:ring-0 p-0 text-[11px] text-on-surface placeholder:text-outline w-full focus:outline-none"
            placeholder="상품 및 주문 검색..."
            type="text"
          />
        </div>

        <Link href="/account" className="flex items-center px-2 py-1.5 rounded-md text-[11px] font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors duration-200">
          <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
          내 계정
        </Link>

        <Link href="/upgrade" target="_blank" className="flex items-center bg-tertiary-container text-on-tertiary-container px-3 py-1.5 rounded-md text-[11px] font-bold shadow-sm hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          업그레이드
        </Link>

        <form action={logoutAction}>
          <button type="submit" className="flex items-center px-2 py-1.5 rounded-md text-[11px] font-medium text-error hover:bg-error/10 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[16px] mr-1" style={{ fontVariationSettings: "'FILL' 0" }}>logout</span>
            로그아웃
          </button>
        </form>
      </div>
    </nav>
  );
}
