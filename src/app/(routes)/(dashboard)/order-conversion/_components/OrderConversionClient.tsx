"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/common/Button";
import { OwnedStoreProps } from "@/core/domain/entities/OwnedStore";
import { ProductCodeSettingProps } from "@/core/domain/entities/ProductCodeSetting";

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

    // 네이버 스마트스토어 주문 양식 변환 로직
    // 플랫폼 이름에 '스마트스토어'나 '네이버'가 포함되어 있다고 가정 (현재는 일괄 적용)
    
    // 엑셀에서 복사 시 포함된 쌍따옴표 및 셀 내부 줄바꿈 처리
    let preprocessedText = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
        continue; // 쌍따옴표 제거
      }
      if (inQuotes) {
        if (char === '\r') continue;
        if (char === '\n') {
          preprocessedText += ' '; // 셀 내부 줄바꿈을 공백으로 치환
          continue;
        }
      }
      preprocessedText += char;
    }

    const lines = preprocessedText.split("\n");
    const convertedLines = lines.map(line => {
      // 빈 줄 무시
      if (!line.trim()) return line;
      
      const columns = line.split("\t");
      
      // 입력 데이터가 10개 이상인지 확인 (기대하는 포맷)
      if (columns.length >= 10) {
        // [0]: 수취인명
        // [1]: 수취인연락처1
        // [2]: 우편번호
        // [3]: 기본배송지
        // [4]: 상세배송지
        // [5]: 배송메시지
        // [6]: 수취인연락처2
        // [7]: 판매자 상품코드
        // [8]: 옵션정보
        // [9]: 수량
        
        let prefix = "";
        if (currentStore) {
          const platformStr = currentStore.platformName || "";
          const siteStr = currentStore.siteName ? currentStore.siteName.substring(0, 2) : "";
          prefix = `${platformStr}${siteStr}`;
        }

        let productCode = columns[7];
        if (currentSetting?.supplierNameDelimiter1) {
          const delimIndex = productCode.indexOf(currentSetting.supplierNameDelimiter1);
          if (delimIndex !== -1) {
            productCode = productCode.substring(delimIndex);
          }
        }
        
        productCode = `${prefix}${productCode}`;
        
        const newColumns = [
          columns[0], // 수취인명
          columns[1], // 수취인연락처1
          columns[2], // 우편번호
          `${columns[3]} ${columns[4]}`.trim(), // 주소(기본배송지+상세배송지)
          columns[5], // 배송메시지
          columns[6], // 수취인연락처2
          `${productCode} ${columns[8]}`.trim(), // 상품명(판매자 상품코드+옵션정보)
          columns[9]  // 수량
        ];
        
        const promo1 = currentStore?.invoicePromo1 || "";
        const promo2 = currentStore?.invoicePromo2 || "";
        if (promo1 || promo2) {
          newColumns.push(promo1);
          if (promo2) {
            newColumns.push(promo2);
          }
        }
        
        return newColumns.join("\t");
      }
      
      // 포맷이 안맞으면 원본 유지
      return line;
    });

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
            </>
          ) : (
            <Button icon="transform" onClick={handleConversion}>변환</Button>
          )}
        </div>
      </div>
    </div>
  );
}
