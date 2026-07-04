// parsers/smartstore.js
window.EgaoParsers = window.EgaoParsers || {};

window.EgaoParsers.smartstore = {
  name: "SmartStore",
  canParse: (url) => {
    return url.includes('smartstore.naver.com') || url.includes('brand.naver.com');
  },
  parse: () => {
    try {
      // 네이버 스마트스토어의 DOM 구조는 수시로 변경될 수 있습니다.
      // 현재 일반적인 스마트스토어 상품 상세 페이지 기준입니다.
      
      const titleEl = document.querySelector('h3._22kNQuEXmb');
      const title = titleEl ? titleEl.innerText.trim() : '';

      const priceEl = document.querySelector('span._1LY7DqCnwR');
      let priceText = priceEl ? priceEl.innerText : '0';
      const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);

      const imgEl = document.querySelector('div._23tQ11TngD img');
      let imageUrl = imgEl ? imgEl.getAttribute('src') : '';

      return {
        platform: 'SmartStore',
        productName: title,
        price: price,
        imageUrl: imageUrl,
        productUrl: window.location.href,
        extraInfo: ''
      };
    } catch (e) {
      console.error("SmartStore Parse Error:", e);
      return null;
    }
  }
};
