// parsers/smartstore.js
window.EgaoParsers = window.EgaoParsers || {};

window.EgaoParsers.smartstore = {
  name: "SmartStore",
  canParse: (url) => {
    return url.includes('smartstore.naver.com') || url.includes('brand.naver.com');
  },
  parse: () => {
    try {
      const currentUrl = window.location.href;

      // 1. 상품명
      const titleEl = document.querySelector('h3._22kNQuEXmb');
      const title = titleEl ? titleEl.innerText.trim() : '';

      // 2. 가격
      const priceEl = document.querySelector('span._1LY7DqCnwR');
      let priceText = priceEl ? priceEl.innerText : '0';
      const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);

      // 3. 썸네일 이미지
      const imgEl = document.querySelector('div._23tQ11TngD img');
      let imageUrl = imgEl ? imgEl.getAttribute('src') : '';

      // 4. 상품번호 파싱 (URL 기준)
      // 예: https://smartstore.naver.com/storename/products/103984920
      let productId = '';
      const match = currentUrl.match(/\/products\/(\d+)/);
      if (match && match[1]) {
        productId = match[1];
      }

      // 5. 상세페이지 설명
      // 스마트스토어의 상세페이지는 se-viewer 클래스 안이나 iframe에 존재하는 경우가 많음.
      // 우선 DOM에 노출된 텍스트 중 가장 유력한 곳을 긁음.
      let description = '';
      const descEl = document.querySelector('.se-viewer') || document.querySelector('.detail_info_inner');
      if (descEl) {
        description = descEl.innerText.substring(0, 3000); // 최대 3000자 제한
      }

      // 6. 대표후기 10개
      // 리뷰는 스크롤하거나 탭을 눌러야 렌더링되므로, 현재 노출되어 있는 리뷰들만 최대한 가져옴.
      const reviews = [];
      const reviewNodes = document.querySelectorAll('ul.TsOLil1PRz li'); // 일반적인 리뷰 리스트 선택자 (변경될 수 있음)
      
      if (reviewNodes.length > 0) {
        for (let i = 0; i < Math.min(reviewNodes.length, 10); i++) {
          const node = reviewNodes[i];
          const textEl = node.querySelector('div.YEtwtZFLDz span._3QDEeS6NmG'); // 리뷰 텍스트 부분
          const text = textEl ? textEl.innerText.trim() : '';
          if (text) {
            reviews.push(text);
          }
        }
      }

      return {
        platform: 'SmartStore',
        productId: productId,
        productName: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        reviews: reviews,
        productUrl: currentUrl
      };
    } catch (e) {
      console.error("SmartStore Parse Error:", e);
      return null;
    }
  }
};
