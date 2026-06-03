"use client";

import { useState } from "react";
import Link from "next/link";

export default function UpgradePage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col">
      {/* No Header */}

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex-1 w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-4">단순하고 투명한 가격 정책</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            비즈니스 규모에 맞는 요금제를 선택하세요. 숨겨진 비용 없이 필요한 만큼만 지불하면 됩니다.
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>월간 결제</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              aria-checked={isYearly} 
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isYearly ? 'bg-primary' : 'bg-outline-variant'}`} 
              role="switch" 
              type="button"
            >
              <span 
                aria-hidden="true" 
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow ring-0 transition duration-200 ease-in-out ${isYearly ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
              연간 결제 <span className="text-primary ml-1">(20% 할인)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* Starter Plan */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col hover:shadow-md transition-shadow">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-on-surface mb-2">Starter</h3>
              <p className="text-sm text-on-surface-variant mb-6">초기 이커머스 셀러를 위한 필수 기능</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-on-surface">
                  {isYearly ? '₩23,200' : '₩29,000'}
                </span>
                <span className="text-sm font-medium text-on-surface-variant">/ 월</span>
              </div>
            </div>
            <ul className="flex flex-col gap-4 mb-12 flex-grow">
              <li className="flex items-start gap-2 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                최대 1,000개 상품 관리
              </li>
              <li className="flex items-start gap-2 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                기본 대시보드 및 리포트
              </li>
              <li className="flex items-start gap-2 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                일 1회 데이터 동기화
              </li>
              <li className="flex items-start gap-2 text-sm text-outline-variant">
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                마진 분석 도구
              </li>
            </ul>
            <Link href="/checkout" className="w-full bg-surface border border-outline-variant text-on-surface text-sm font-medium h-9 rounded hover:bg-surface-container-low transition-colors duration-200 flex items-center justify-center">
              구독하기
            </Link>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="bg-surface-container-lowest border-2 border-primary rounded-xl p-8 flex flex-col relative shadow-lg transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
              가장 인기있는 요금제
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-on-surface mb-2">Professional</h3>
              <p className="text-sm text-on-surface-variant mb-6">성장하는 비즈니스를 위한 고급 분석</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-on-surface">
                  {isYearly ? '₩71,200' : '₩89,000'}
                </span>
                <span className="text-sm font-medium text-on-surface-variant">/ 월</span>
              </div>
            </div>
            <ul className="flex flex-col gap-4 mb-12 flex-grow">
              <li className="flex items-start gap-2 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                무제한 상품 관리
              </li>
              <li className="flex items-start gap-2 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                고급 마진 분석 및 예측
              </li>
              <li className="flex items-start gap-2 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                실시간 데이터 동기화
              </li>
              <li className="flex items-start gap-2 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                우선 지원 서비스
              </li>
            </ul>
            <Link href="/checkout" className="w-full bg-primary text-on-primary text-sm font-medium h-9 rounded hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200 flex items-center justify-center">
              구독하기
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col hover:shadow-md transition-shadow">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-on-surface mb-2">Enterprise</h3>
              <p className="text-sm text-on-surface-variant mb-6">대규모 운영을 위한 맞춤형 솔루션</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-on-surface">맞춤 문의</span>
              </div>
            </div>
            <ul className="flex flex-col gap-4 mb-12 flex-grow">
              <li className="flex items-start gap-2 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Pro 요금제 모든 기능 포함
              </li>
              <li className="flex items-start gap-2 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                전담 어카운트 매니저
              </li>
              <li className="flex items-start gap-2 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                맞춤형 API 연동 지원
              </li>
              <li className="flex items-start gap-2 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                SLA 보장
              </li>
            </ul>
            <button className="w-full bg-surface border border-outline-variant text-on-surface text-sm font-medium h-9 rounded hover:bg-surface-container-low transition-colors duration-200">
              영업팀 문의
            </button>
          </div>
        </div>

        {/* Payment Provider Section */}
        <div className="mt-12 text-center border-t border-outline-variant pt-8">
          <p className="text-sm font-medium text-on-surface-variant mb-4">안전하고 간편한 결제 지원</p>
          <div className="flex justify-center items-center opacity-80 grayscale hover:grayscale-0 transition-all duration-300">
            <div className="text-2xl font-bold text-surface-tint flex items-center gap-2">
              <span className="material-symbols-outlined text-[32px]">payments</span>
              toss payments
            </div>
          </div>
        </div>
      </main>

      {/* No Footer */}
    </div>
  );
}
