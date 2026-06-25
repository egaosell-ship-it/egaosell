"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/common/Button";
import { OwnedStoreProps } from "@/core/domain/entities/OwnedStore";
import { ProductCodeSettingProps } from "@/core/domain/entities/ProductCodeSetting";
import { convertOrderData } from "@/lib/orderConversion";

interface OrderConversionBatchClientProps {
  ownedStores: OwnedStoreProps[];
  productCodeSettings: ProductCodeSettingProps[];
  margins: any[]; // Or properly typed if needed
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function OrderConversionBatchClient({ ownedStores, productCodeSettings, margins }: OrderConversionBatchClientProps) {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [isConverted, setIsConverted] = useState(false);
  const [combinedResult, setCombinedResult] = useState("");

  const handleChange = (storeId: string, value: string) => {
    setTexts(prev => ({ ...prev, [storeId]: value }));
    if (isConverted) {
      setIsConverted(false);
      setCombinedResult("");
    }
  };

  const handleConversion = () => {
    let allConvertedLines: string[] = [];

    ownedStores.forEach(store => {
      const storeId = store.id || "";
      const text = texts[storeId];
      if (!text || !text.trim()) return;

      const currentSetting = productCodeSettings.find(s => s.platformName === store.platformName);
      const convertedLines = convertOrderData(text, store, currentSetting);
      
      allConvertedLines = [...allConvertedLines, ...convertedLines];
    });

    if (allConvertedLines.length === 0) return;

    setCombinedResult(allConvertedLines.join("\n"));
    setIsConverted(true);
  };

  const handleRevert = () => {
    setIsConverted(false);
    setCombinedResult("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(combinedResult);
      alert("클립보드에 복사되었습니다.");
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };

  const handleExcelDownload = () => {
    if (!combinedResult.trim()) return;

    const headers = ["수령인", "휴대전화", "우편번호", "주소", "배송메시지", "연락처2", "상품명", "수량", "홍보문구1", "홍보문구2"];
    const rows = combinedResult.split("\n").map(line => line.split("\t"));
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "통합주문데이터");

    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${mm}.${dd}.${hh}.${min}`;

    const filename = `배송.통합변환.${timeStr}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
  };

  if (isConverted) {
    return (
      <div className="flex-1 flex flex-col mt-2 min-h-[400px]">
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="material-symbols-outlined text-[20px] text-primary">done_all</span>
          <span className="text-sm font-bold text-on-surface">통합 변환 결과</span>
        </div>
        
        <div className="flex-1 flex flex-col border border-outline-variant rounded-md overflow-hidden shadow-sm bg-surface">
          <textarea 
            className="flex-1 w-full p-4 text-sm text-on-surface bg-transparent resize-none focus:outline-none"
            readOnly
            value={combinedResult}
          />
          <div className="border-t border-outline-variant p-3 flex justify-end shrink-0 gap-2 bg-surface-variant/30">
            <Button icon="undo" variant="outline" onClick={handleRevert}>이전단계</Button>
            <Button icon="content_copy" onClick={handleCopy}>복사</Button>
            <Button icon="download" onClick={handleExcelDownload}>엑셀다운로드</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-2 gap-6">
      {ownedStores.length === 0 ? (
        <div className="py-12 text-center text-sm text-on-surface-variant border border-outline-variant rounded-md">
          등록된 스토어가 없습니다. 설정 메뉴에서 보유스토어를 추가해주세요.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {ownedStores.map(store => {
            const margin = margins.find(m => m.platformName === store.platformName);
            const currentColor = margin?.colorCode || "#E2E8F0";
            const storeId = store.id || "";

            return (
              <div key={storeId} className="flex flex-col">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="material-symbols-outlined text-[18px]" style={{ color: currentColor }}>storefront</span>
                  <span className="text-sm font-bold text-on-surface">
                    {store.platformName === '네이버' ? '스마트스토어' : store.platformName}({store.siteName})
                  </span>
                </div>
                <div className="flex flex-col border border-outline-variant rounded-md overflow-hidden shadow-sm h-[150px]" style={{ backgroundColor: hexToRgba(currentColor, 0.05) }}>
                  <textarea 
                    className="flex-1 w-full p-3 text-sm text-on-surface bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={`${store.platformName === '네이버' ? '스마트스토어' : store.platformName} 주문 데이터를 붙여넣으세요...`}
                    value={texts[storeId] || ""}
                    onChange={(e) => handleChange(storeId, e.target.value)}
                  />
                </div>
              </div>
            );
          })}

          <div className="flex justify-end mt-4 sticky bottom-4 z-10">
            <Button icon="transform" onClick={handleConversion} className="shadow-lg">한꺼번에 변환</Button>
          </div>
        </div>
      )}
    </div>
  );
}
