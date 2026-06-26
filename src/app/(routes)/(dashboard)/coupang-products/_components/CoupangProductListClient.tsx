'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

interface CoupangProductListClientProps {
  initialProducts: any[];
  mainBusinessName: string;
  businessId: string | null;
}

export function CoupangProductListClient({ initialProducts, mainBusinessName, businessId }: CoupangProductListClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');

  // 검색된 데이터
  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    const nameMatch = product.supply_product_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-56px-64px)] w-full">
      {/* Search and Action Bar */}
      <div className="flex items-center justify-between p-4 bg-surface-container-lowest border-b border-outline-variant flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="상품명 또는 관리코드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px] h-9 text-sm px-3 border border-outline-variant rounded-md bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="text-xs text-on-surface-variant ml-2">
            검색 결과: <strong className="text-primary">{filteredProducts.length}</strong>건
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* 빈 액션 영역 */}
          <Button variant="secondary" className="h-9 text-sm px-4">
            옵션 버튼
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-surface-container-lowest">
        <div className="absolute inset-0 overflow-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-outline-variant border-collapse">
              <thead className="bg-surface-container-low sticky top-0 z-20">
                <tr>
                  <th scope="col" className="px-3 py-3 text-center text-xs font-semibold text-on-surface whitespace-nowrap border-r border-outline-variant w-16">
                    번호
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-on-surface whitespace-nowrap border-r border-outline-variant w-32">
                    상호
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-on-surface whitespace-nowrap border-r border-outline-variant w-28">
                    판매방식
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-on-surface whitespace-nowrap border-r border-outline-variant w-36">
                    쿠팡관리코드
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-on-surface whitespace-nowrap border-r border-outline-variant min-w-[200px]">
                    업체명-공급상품명
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-on-surface whitespace-nowrap border-r border-outline-variant w-32">
                    판매가
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-on-surface whitespace-nowrap border-r border-outline-variant w-32">
                    공급가
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-on-surface whitespace-nowrap border-r border-outline-variant w-24">
                    중요도
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-on-surface whitespace-nowrap border-r border-outline-variant w-32">
                    마진
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-on-surface whitespace-nowrap w-32">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <tr key={product.id || index} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-3 py-3 text-xs text-center text-on-surface-variant border-r border-outline-variant">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-xs text-on-surface-variant border-r border-outline-variant">
                        {mainBusinessName}
                      </td>
                      <td className="px-4 py-3 text-xs text-center text-on-surface-variant border-r border-outline-variant">
                        {product.sale_method || '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-on-surface border-r border-outline-variant">
                        {product.coupang_product_code || '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-on-surface font-medium border-r border-outline-variant">
                        {product.supplier_name ? `${product.supplier_name}-${product.supply_product_name}` : product.supply_product_name}
                      </td>
                      <td className="px-4 py-3 text-xs text-right text-on-surface-variant border-r border-outline-variant">
                        {product.sell_price ? product.sell_price.toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-right text-on-surface-variant border-r border-outline-variant">
                        {product.supply_price ? product.supply_price.toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-center text-on-surface-variant border-r border-outline-variant">
                        {product.importance || '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-right font-medium text-secondary border-r border-outline-variant">
                        {product.margin ? product.margin.toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-xs text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-primary hover:underline">수정</button>
                          <span className="text-outline-variant">|</span>
                          <button className="text-error hover:underline">삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-sm text-on-surface-variant">
                      데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
