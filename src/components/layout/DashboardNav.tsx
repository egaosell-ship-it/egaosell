'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { logoutAction } from '@/app/actions/auth.actions';
import { BusinessProps } from '@/core/domain/entities/Business';
import { PlatformMarginProps } from '@/core/domain/entities/PlatformMargin';

interface DashboardNavProps {
  businesses?: BusinessProps[];
  margins?: PlatformMarginProps[];
}

export default function DashboardNav({ businesses = [], margins = [] }: DashboardNavProps) {
  const pathname = usePathname();
  const [isOrderConversionModalOpen, setIsOrderConversionModalOpen] = useState(false);

  const sortedBusinesses = [...businesses].sort((a, b) => {
    if (a.isMain && !b.isMain) return -1;
    if (!a.isMain && b.isMain) return 1;
    return 0;
  });

  const navLinks = [
    { name: '대시보드', href: '/' },
    { name: '주문 변환', href: '/order-conversion' },
    { name: '주문 수집', href: '/order-collection' },
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

            // 주문 변환 클릭 시 모달 띄우기 특별 처리
            if (link.name === '주문 변환') {
              return (
                <div key={link.name} className="h-full flex items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOrderConversionModalOpen(true);
                    }}
                    className={`flex items-center h-full px-3 border-b-2 transition-colors duration-200 text-[11px] font-medium cursor-pointer ${
                      isActive
                        ? 'border-primary text-primary-fixed-variant'
                        : 'border-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {link.name}
                  </button>
                </div>
              );
            }

            // 주문 수집 드롭다운 처리 (기존 유지)
            if (link.name === '주문 수집') {
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
                        return (
                          <Link 
                            key={biz.id} 
                            href={`${link.href}?businessId=${biz.id}`}
                            className="block px-4 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                          >
                            {biz.companyName} {biz.isMain && '(★)'}
                          </Link>
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

      {/* 주문 변환 모달 팝업 */}
      {isOrderConversionModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl p-6 w-[400px] border border-outline-variant max-w-[90vw]">
            <h2 className="text-title-md font-bold text-on-surface mb-6 text-center">상호를 선택해주세요!</h2>
            
            {sortedBusinesses.length === 0 ? (
              <div className="text-center text-secondary py-4">등록된 사업자(상호)가 없습니다.</div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-on-surface mb-6">
                {sortedBusinesses.map((biz, idx) => (
                  <div key={biz.id} className="flex items-center">
                    <Link
                      href={`/order-conversion?businessId=${biz.id}`}
                      onClick={() => setIsOrderConversionModalOpen(false)}
                      className="text-primary hover:text-primary-fixed-variant hover:underline font-semibold transition-colors whitespace-nowrap"
                    >
                      {biz.companyName} {biz.isMain ? '(별 주사업자)' : ''}
                    </Link>
                    {idx < sortedBusinesses.length - 1 && (
                      <span className="mx-2 text-outline-variant">|</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-center mt-2">
              <button
                onClick={() => setIsOrderConversionModalOpen(false)}
                className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-md text-sm font-medium transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
