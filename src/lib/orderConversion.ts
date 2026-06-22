import { OwnedStoreProps } from "@/core/domain/entities/OwnedStore";
import { ProductCodeSettingProps } from "@/core/domain/entities/ProductCodeSetting";

export function convertOrderData(text: string, currentStore: OwnedStoreProps | null, currentSetting?: ProductCodeSettingProps | null): string[] {
  if (!text.trim()) return [];

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
    
    let prefix = "";
    if (currentStore) {
      const platformStr = currentStore.platformName || "";
      const siteStr = currentStore.siteName ? currentStore.siteName.substring(0, 2) : "";
      prefix = `${platformStr}${siteStr}`;
    }

    const isCoupang = currentStore?.platformName?.includes("쿠팡");
    const isToss = currentStore?.platformName?.includes("토스");
    const isEsm = currentStore?.platformName?.includes("ESM");

    if (isEsm && columns.length >= 23) {
      let productCode = columns[15];
      if (currentSetting?.supplierNameDelimiter1) {
        const delimIndex = productCode.indexOf(currentSetting.supplierNameDelimiter1);
        if (delimIndex !== -1) {
          productCode = productCode.substring(delimIndex);
        }
      }
      productCode = `${prefix}${productCode}`;

      const newColumns = [
        columns[0], // 수령인명
        columns[17], // 수령인휴대폰
        columns[20], // 우편번호
        columns[21].trim(), // 주소
        columns[22], // 배송시요구사항
        columns[18], // 수령인전화번호(연락처2)
        `${productCode}${columns[7]}`.trim(), // 상품명
        columns[6]  // 수량
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

    } else if (isToss && columns.length >= 13) {
      let productCode = columns[3];
      if (currentSetting?.supplierNameDelimiter1) {
        const delimIndex = productCode.indexOf(currentSetting.supplierNameDelimiter1);
        if (delimIndex !== -1) {
          productCode = productCode.substring(delimIndex);
        }
      }

      const delim1 = currentSetting?.supplierNameDelimiter1 || '[';
      const delim2 = currentSetting?.supplierNameDelimiter2 || ']';
      if (!productCode.startsWith(delim1)) {
        productCode = `${delim1}${productCode}${delim2}`;
      }
      
      productCode = `${prefix}${productCode}`;
      const optionName = columns[0].replace(/,/g, '');

      const newColumns = [
        columns[8], // 수령인명
        columns[9], // 수령인연락처
        columns[10], // 우편번호
        columns[11].trim(), // 배송지
        columns[12], // 주문요청사항
        columns[7], // 구매자연락처
        `${productCode}${optionName}`.trim(), // 상품명
        columns[1]  // 수량
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

    } else if (isCoupang && columns.length >= 8) {
      let productCode = columns[0];
      if (currentSetting?.supplierNameDelimiter1) {
        const delimIndex = productCode.indexOf(currentSetting.supplierNameDelimiter1);
        if (delimIndex !== -1) {
          productCode = productCode.substring(delimIndex);
        }
      }
      productCode = `${prefix}${productCode}`;

      const newColumns = [
        columns[3], // 수취인명
        columns[4], // 수취인연락처1
        columns[5], // 우편번호
        columns[6].trim(), // 주소
        columns[7], // 배송메시지
        "",         // 연락처2
        `${productCode} ${columns[1]}`.trim(), // 상품명
        columns[2]  // 수량
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

    } else if (!isCoupang && !isToss && !isEsm && columns.length >= 10) {
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
        `${columns[3]} ${columns[4]}`.trim(), // 주소
        columns[5], // 배송메시지
        columns[6], // 수취인연락처2
        `${productCode} ${columns[8]}`.trim(), // 상품명
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
    
    return line;
  });

  return convertedLines;
}
