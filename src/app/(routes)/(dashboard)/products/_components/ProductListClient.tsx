"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Panel } from "@/components/common/Panel";

export function ProductListClient() {
  const [perPage, setPerPage] = useState("100");

  // 레이아웃 구성을 위한 더미 데이터 생성
  const dummyProducts = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 1,
    naverId: `NV${100000 + i}`,
    imageUrl: "https://via.placeholder.com/40",
    supplierName: "도매매",
    brandName: "자유브랜드",
    productName: `샘플 상품명 ${i + 1}`,
    supplyPrice: 12000 + (i * 1000),
    sellPrice: 18000 + (i * 1500),
    platformProfit: "네이버 / 4,500원",
    isUsed: i % 2 === 0 ? "Y" : "N",
  }));

  return (
    <div className="flex flex-col gap-4 mt-6">
      <Panel>
        {/* 상단 컨트롤 영역 */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold text-on-surface">
            총 <span className="text-primary font-bold">1,240</span>개의 상품
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" icon="upload">
              엑셀업로드
            </Button>
            <Button variant="outline" icon="download">
              엑셀다운로드
            </Button>
            
            <select
              value={perPage}
              onChange={(e) => setPerPage(e.target.value)}
              className="ml-2 bg-surface-container-low border border-outline-variant text-on-surface text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="100">100개 보기</option>
              <option value="200">200개 보기</option>
              <option value="500">500개 보기</option>
              <option value="1000">1000개 보기</option>
            </select>
          </div>
        </div>

        {/* 데이터 테이블 영역 */}
        <div className="overflow-x-auto border border-outline-variant rounded-md">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">번호</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">네이버상품번호</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">사진</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">공급사명</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">브랜드명</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider min-w-[200px]">공급상품명</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">공급가</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">판매가격</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">등록플랫폼/순이익</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">사용여부</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-sm text-on-surface bg-surface-container-lowest">
              {dummyProducts.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-2 px-4 text-center">{product.id}</td>
                  <td className="py-2 px-4 font-medium text-primary">{product.naverId}</td>
                  <td className="py-2 px-4 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.imageUrl} alt="상품 이미지" className="w-10 h-10 object-cover border border-outline-variant rounded" />
                  </td>
                  <td className="py-2 px-4">{product.supplierName}</td>
                  <td className="py-2 px-4">{product.brandName}</td>
                  <td className="py-2 px-4 font-medium truncate max-w-[250px]" title={product.productName}>{product.productName}</td>
                  <td className="py-2 px-4 text-right">₩{product.supplyPrice.toLocaleString()}</td>
                  <td className="py-2 px-4 text-right font-semibold text-error">₩{product.sellPrice.toLocaleString()}</td>
                  <td className="py-2 px-4">{product.platformProfit}</td>
                  <td className="py-2 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      product.isUsed === 'Y' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {product.isUsed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {dummyProducts.length === 0 && (
            <div className="py-12 text-center text-secondary">
              등록된 상품이 없습니다.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
