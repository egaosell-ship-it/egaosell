'use client';

import { useState, useMemo } from 'react';

export default function CalculatorPage() {
  const [sell, setSell] = useState<number>(35000);
  const [supply, setSupply] = useState<number>(15000);
  const [feeRate, setFeeRate] = useState<number>(11.5);
  const [shipping, setShipping] = useState<number>(3000);
  const [other, setOther] = useState<number>(500);

  const feeAmount = sell * (feeRate / 100);
  const totalCost = supply + feeAmount + shipping + other;
  const netMargin = sell - totalCost;
  const marginRate = sell > 0 ? (netMargin / sell) * 100 : 0;

  const krw = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 });
  const calcRate = (val: number) => sell > 0 ? ((val / sell) * 100).toFixed(1) + '%' : '0.0%';

  const resetCalculator = () => {
    setSell(0);
    setSupply(0);
    setFeeRate(0);
    setShipping(0);
    setOther(0);
  };

  return (
    <>
      <div className="mb-4">
        <h1 className="text-headline-sm font-headline-sm text-on-surface font-bold">마진 계산기</h1>
        <p className="text-sm text-secondary mt-1">상품의 판매가와 각종 비용을 입력하여 정확한 순마진을 시뮬레이션 하세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Panel: Interactive Inputs */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>calculate</span>
              <h2 className="text-sm font-semibold text-on-surface">비용 입력</h2>
            </div>
            <div className="space-y-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1" htmlFor="input-sell">판매가</label>
                <div className="relative">
                  <input
                    className="w-full h-8 border border-outline-variant rounded bg-surface-container-lowest px-2 text-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all pr-8 text-right"
                    id="input-sell"
                    type="number"
                    value={sell || ''}
                    onChange={(e) => setSell(parseFloat(e.target.value) || 0)}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary">원</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1" htmlFor="input-supply">공급가 (도매 원가)</label>
                <div className="relative">
                  <input
                    className="w-full h-8 border border-outline-variant rounded bg-surface-container-lowest px-2 text-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all pr-8 text-right"
                    id="input-supply"
                    type="number"
                    value={supply || ''}
                    onChange={(e) => setSupply(parseFloat(e.target.value) || 0)}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary">원</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1" htmlFor="input-fee">마켓 수수료</label>
                  <div className="relative">
                    <input
                      className="w-full h-8 border border-outline-variant rounded bg-surface-container-lowest px-2 text-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all pr-8 text-right"
                      id="input-fee"
                      step="0.1"
                      type="number"
                      value={feeRate || ''}
                      onChange={(e) => setFeeRate(parseFloat(e.target.value) || 0)}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1" htmlFor="input-shipping">배송비</label>
                  <div className="relative">
                    <input
                      className="w-full h-8 border border-outline-variant rounded bg-surface-container-lowest px-2 text-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all pr-8 text-right"
                      id="input-shipping"
                      type="number"
                      value={shipping || ''}
                      onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary">원</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1" htmlFor="input-other">기타 비용 (포장, 인건비 등)</label>
                <div className="relative">
                  <input
                    className="w-full h-8 border border-outline-variant rounded bg-surface-container-lowest px-2 text-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all pr-8 text-right"
                    id="input-other"
                    type="number"
                    value={other || ''}
                    onChange={(e) => setOther(parseFloat(e.target.value) || 0)}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary">원</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-outline-variant flex justify-end gap-2">
              <button
                className="px-3 py-1.5 rounded border border-outline-variant bg-surface-container-lowest text-on-surface text-xs font-medium hover:bg-surface-container-low transition-colors"
                onClick={resetCalculator}
              >
                초기화
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: KPI & Breakdown Table */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Net Margin KPI */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 border-b-2 border-b-primary-container flex flex-col shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 0" }}>payments</span>
              </div>
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">예상 순마진</span>
              <div className="text-headline-sm font-bold text-on-surface tracking-tight">{krw.format(netMargin)}</div>
              <div className="mt-auto pt-3">
                <span className="text-[11px] font-medium text-secondary bg-surface-container-low px-2 py-1 rounded inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 0" }}>info</span> 판매 1건당 수익
                </span>
              </div>
            </div>

            {/* Margin Rate KPI */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 border-b-2 border-b-primary flex flex-col shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 0" }}>monitoring</span>
              </div>
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">마진율</span>
              <div className={`text-headline-sm font-bold tracking-tight ${marginRate < 0 ? 'text-error' : 'text-primary'}`}>
                {marginRate.toFixed(2)}%
              </div>
              <div className="mt-auto pt-3">
                <span className="text-[11px] font-medium text-secondary bg-surface-container-low px-2 py-1 rounded inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 0" }}>target</span> 목표수익률 대비 양호
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Table */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
              <h3 className="text-sm font-semibold text-on-surface">상세 비용 구조</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-4 py-2 text-[11px] text-secondary font-semibold uppercase w-1/3">항목</th>
                    <th className="px-4 py-2 text-[11px] text-secondary font-semibold uppercase text-right">금액</th>
                    <th className="px-4 py-2 text-[11px] text-secondary font-semibold uppercase text-right w-1/4">비율 (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50 text-xs">
                  {/* Revenue Row */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-4 py-2 text-on-surface font-medium flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      판매가
                    </td>
                    <td className="px-4 py-2 text-on-surface text-right font-medium">{krw.format(sell)}</td>
                    <td className="px-4 py-2 text-secondary text-right">100.0%</td>
                  </tr>
                  
                  {/* Costs Rows */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group text-secondary">
                    <td className="px-4 py-2 pl-8 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-outline">remove</span> 공급가
                    </td>
                    <td className="px-4 py-2 text-right">- {krw.format(supply)}</td>
                    <td className="px-4 py-2 text-right">{calcRate(supply)}</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors group text-secondary">
                    <td className="px-4 py-2 pl-8 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-outline">remove</span> 마켓 수수료
                    </td>
                    <td className="px-4 py-2 text-right">- {krw.format(feeAmount)}</td>
                    <td className="px-4 py-2 text-right">{feeRate.toFixed(1)}%</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors group text-secondary">
                    <td className="px-4 py-2 pl-8 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-outline">remove</span> 배송비
                    </td>
                    <td className="px-4 py-2 text-right">- {krw.format(shipping)}</td>
                    <td className="px-4 py-2 text-right">{calcRate(shipping)}</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors group text-secondary">
                    <td className="px-4 py-2 pl-8 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-outline">remove</span> 기타 비용
                    </td>
                    <td className="px-4 py-2 text-right">- {krw.format(other)}</td>
                    <td className="px-4 py-2 text-right">{calcRate(other)}</td>
                  </tr>
                  
                  {/* Summary Row */}
                  <tr className="bg-surface border-t-2 border-outline-variant">
                    <td className="px-4 py-2 text-on-surface font-semibold">총 비용</td>
                    <td className="px-4 py-2 text-on-surface font-semibold text-right">{krw.format(totalCost)}</td>
                    <td className="px-4 py-2 text-secondary font-semibold text-right">{calcRate(totalCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
