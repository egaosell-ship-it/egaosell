const inputText = `정병영	김병영	N		N		2	블랙:255/2개						62900	62900	30000-엘유티[사이퍼]		010-2542-1159	010-2542-1259	N	16584	경기도 수원시 권선구 덕영대로1217번길 24 (두산동아아파트) 108동 1006호	부재시문앞에놓아주세요.`;

const store = {
  platformName: "ESM",
  siteName: "액션",
  invoicePromo1: "네이버에서[액션런]검색",
  invoicePromo2: "구글에서[액션런]검색"
};

const setting = {
  platformName: "ESM",
  supplierNameDelimiter1: "["
};

function testConvert(text: string, currentStore: any, currentSetting: any) {
  let preprocessedText = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue; 
    }
    if (inQuotes) {
      if (char === '\r') continue;
      if (char === '\n') {
        preprocessedText += ' '; 
        continue;
      }
    }
    preprocessedText += char;
  }

  const lines = preprocessedText.split("\n");
  const convertedLines = lines.map(line => {
    if (!line.trim()) return null;
    
    const columns = line.split("\t");
    console.log("Columns length:", columns.length);
    console.log("Columns:", columns);

    const isEsm = currentStore?.platformName?.includes("ESM");
    console.log("isEsm:", isEsm);
    
    let newColumns: string[] = [];
    const promoCols: string[] = [];
    if (currentStore?.invoicePromo1) promoCols.push(currentStore.invoicePromo1);
    if (currentStore?.invoicePromo2) promoCols.push(currentStore.invoicePromo2);

    if (isEsm) {
      if (columns.length !== 23) {
        console.error("ESM length validation failed. Expected 23, got", columns.length);
        return null; // throw 에러 대신 null 반환
      }
      let productCode = columns[15];
      console.log("ProductCode original:", productCode);
      if (currentSetting?.supplierNameDelimiter1) {
        const delimIndex = productCode.indexOf(currentSetting.supplierNameDelimiter1);
        if (delimIndex !== -1) {
          productCode = productCode.substring(delimIndex);
        }
      }
      const prefix = `${currentStore.platformName}${currentStore.siteName ? currentStore.siteName.substring(0, 2) : ""}`;
      productCode = `${prefix}${productCode}`;
      
      newColumns = [
        columns[0], // 수령인명
        columns[18], 
        columns[20], // 우편번호
        columns[21].trim(), // 주소
        columns[22], // 배송시요구사항
        columns[17], 
        `${productCode}${columns[7]}`.trim(), // 상품명
        columns[6]  // 수량
      ];
      newColumns.push(...promoCols);
      console.log("newColumns inside isEsm:", newColumns);
    }

    if (newColumns.length > 0 && newColumns[0].length === 1) {
      newColumns[0] = `(${newColumns[0]})`;
    }

    const joined = newColumns.join("\t");
    console.log("Joined line:", joined);
    return joined;
  }).filter((line): line is string => line !== null && line.trim() !== "");

  return convertedLines;
}

const result = testConvert(inputText, store, setting);
console.log('Result:', result);
