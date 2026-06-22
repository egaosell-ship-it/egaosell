"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/common/Button";
import { OwnedStoreProps } from "@/core/domain/entities/OwnedStore";
import { ProductCodeSettingProps } from "@/core/domain/entities/ProductCodeSetting";
import { convertOrderData } from "@/lib/orderConversion";

interface OrderConversionClientProps {
  currentStore: OwnedStoreProps | null;
  currentColor: string;
  currentSetting?: ProductCodeSettingProps | null;
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function OrderConversionClient({ currentStore, currentColor, currentSetting }: OrderConversionClientProps) {
  const [text, setText] = useState("");
  const originalTextRef = useRef("");
  const [isConverted, setIsConverted] = useState(false);

  const handleConversion = () => {
    if (!text.trim()) return;
    originalTextRef.current = text;

    const convertedLines = convertOrderData(text, currentStore, currentSetting);

    setText(convertedLines.join("\n"));
    setIsConverted(true);
  };

  const handleRevert = () => {
    setText(originalTextRef.current);
    setIsConverted(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 복사되었습니다.");
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };

  const handleExcelDownload = () => {
    if (!text.trim()) return;

    const headers = ["수령인", "휴대전화", "우편번호", "주소", "배송메시지", "연락처2", "상품명", "수량", "홍보문구1", "홍보문구2"];
    const rows = text.split("\n").map(line => line.split("\t"));
    
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "주문데이터");

    let platformStr = "플랫폼미상";
    let siteStr = "";
    if (currentStore) {
      platformStr = currentStore.platformName || "플랫폼미상";
      siteStr = currentStore.siteName ? currentStore.siteName.substring(0, 2) : "";
    }

    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${mm}.${dd}.${hh}.${min}`;

    const filename = `배송.${platformStr}.${siteStr}.${timeStr}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (isConverted) {
      setIsConverted(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col mt-2 min-h-[400px]">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="material-symbols-outlined text-[20px]" style={{ color: currentColor }}>storefront</span>
        <span className="text-sm font-bold text-on-surface">
          {currentStore ? `${currentStore.platformName}(${currentStore.siteName})` : "스토어 미지정"}
        </span>
        <span className="text-xs text-on-surface-variant">스토어 주문 데이터 변환</span>
      </div>
      
      <div className="flex-1 flex flex-col border border-outline-variant rounded-md overflow-hidden shadow-sm" style={{ backgroundColor: hexToRgba(currentColor, 0.1) }}>
        <textarea 
          className="flex-1 w-full p-4 text-sm text-on-surface bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="여기에 주문 데이터를 붙여넣으세요..."
          value={text}
          onChange={handleChange}
        />
        <div className="border-t border-outline-variant p-3 flex justify-end shrink-0 gap-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
          {isConverted ? (
            <>
              <Button icon="undo" variant="outline" onClick={handleRevert}>이전단계</Button>
              <Button icon="content_copy" onClick={handleCopy}>복사</Button>
              <Button icon="download" onClick={handleExcelDownload}>엑셀다운로드</Button>
            </>
          ) : (
            <Button icon="transform" onClick={handleConversion}>변환</Button>
          )}
        </div>
      </div>
    </div>
  );
}
