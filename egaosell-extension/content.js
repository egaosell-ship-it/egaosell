// content.js
// 팝업으로부터 메시지를 수신 대기합니다.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "EXTRACT_PRODUCT_INFO") {
    
    let productData = null;
    const currentUrl = window.location.href;

    // window.EgaoParsers 객체는 manifest.json을 통해 미리 주입된 파서들입니다.
    if (window.EgaoParsers) {
      for (const parserKey in window.EgaoParsers) {
        const parser = window.EgaoParsers[parserKey];
        if (parser.canParse(currentUrl)) {
          console.log(`[EgaoSell] ${parser.name} 파서로 파싱을 시작합니다.`);
          productData = parser.parse();
          break;
        }
      }
    }

    if (productData) {
      sendResponse({ success: true, data: productData });
    } else {
      sendResponse({ success: false, error: "지원하지 않는 페이지이거나 상품 정보를 찾을 수 없습니다." });
    }
  }
  return true; // 비동기 응답 지원
});
