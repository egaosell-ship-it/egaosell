'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth.actions';
import { BusinessProps } from '@/core/domain/entities/Business';
import { PlatformMarginProps } from '@/core/domain/entities/PlatformMargin';

interface DashboardNavProps {
  businesses?: BusinessProps[];
  margins?: PlatformMarginProps[];
}

export default function DashboardNav({ businesses = [], margins = [] }: DashboardNavProps) {
  const pathname = usePathname();

  const sortedBusinesses = [...businesses].sort((a, b) => {
    if (a.isMain && !b.isMain) return -1;
    if (!a.isMain && b.isMain) return 1;
    return 0;
  });

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

            // 주문 변환 메뉴 특별 처리 (드롭다운)
            if (link.name === '주문 변환') {
              return (
                <div key={link.name} className="relative group h-full flex items-center">
                  <Link
                    href={link.href}
                    className={`flex items-center h-full px-3 border-b-2 transition-colors duration-200 text-[11px] font-medium ${
                      isActive
                        ? 'border-primary text-primary-fixed-variant'
                        : 'border-transparent text-on-surface-variant group-hover:text-on-surface'
                    }`}
                  >
                    {link.name}
                  </Link>

                  {/* 1 Depth: 사업자 목록 */}
                  <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-surface-container-lowest border border-outline-variant rounded-md shadow-lg py-2 mt-0 z-[60]">
                    {sortedBusinesses.length === 0 ? (
                      <div className="px-4 py-2 text-xs text-on-surface-variant">등록된 상호가 없습니다.</div>
                    ) : (
                      sortedBusinesses.map((biz) => {
                        const bizMargins = margins.filter(m => m.businessId === biz.id);

                        return (
                          <div key={biz.id} className="relative group/sub">
                            <div className="px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low cursor-default flex justify-between items-center">
                              <span>{biz.companyName} {biz.isMain && '(★)'}</span>
                              {bizMargins.length > 0 && <span className="material-symbols-outlined text-[14px]">chevron_right</span>}
                            </div>

                            {/* 2 Depth: 플랫폼 목록 */}
                            {bizMargins.length > 0 && (
                              <div className="absolute top-0 left-full hidden group-hover/sub:block w-48 bg-surface-container-lowest border border-outline-variant rounded-md shadow-lg py-2 ml-0 z-[70]">
                                {bizMargins.map(margin => (
                                  <Link
                                    key={margin.id}
                                    href={`/order-conversion?businessId=${biz.id}&platform=${encodeURIComponent(margin.platformName)}`}
                                    className="block px-4 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                                  >
                                    {margin.platformName}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            }

            // 그 외 일반 메뉴
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

        <Link href="/settings" className="flex items-center px-2 py-1.5 rounded-md text-[11px] font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors duration-200">
          <span className="text-[16px] mr-1">⚙️</span>
          설정
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
