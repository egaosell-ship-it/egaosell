// parsers/daiso.js
window.EgaoParsers = window.EgaoParsers || {};

window.EgaoParsers.daiso = {
  name: "DaisoMall",
  canParse: (url) => {
    return url.includes('daisomall.co.kr');
  },
  parse: () => {
    try {
      const currentUrl = window.location.href;

      // 1. 상품명 (og:title 메타태그 활용)
      let title = '';
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        title = ogTitle.getAttribute('content');
      }
      if (!title) {
        // 다이소몰 일반적인 상품명 클래스 (추측, 추후 업데이트 필요)
        const titleEl = document.querySelector('.goods-title') || document.querySelector('.product-title');
        title = titleEl ? titleEl.innerText.trim() : '다이소몰 상품 (제목 파싱 실패)';
      }

      // 2. 가격
      let price = 0;
      // 다이소몰 일반적인 가격 클래스 (추측)
      const priceEl = document.querySelector('.goods-price') || document.querySelector('.price-value') || document.querySelector('.price');
      if (priceEl) {
        const priceText = priceEl.innerText || priceEl.textContent;
        price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;
      } else {
        // 가격을 못 찾을 경우 0으로 둠
        price = 0;
      }

      // 3. 썸네일 이미지 (og:image 활용)
      let imageUrl = '';
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        imageUrl = ogImage.getAttribute('content');
      }
      if (!imageUrl) {
        const imgEl = document.querySelector('.goods-thumb img');
        imageUrl = imgEl ? imgEl.getAttribute('src') : '';
      }

      // 4. 상품번호 파싱 (URL이나 특정 요소 기반)
      // 예: https://www.daisomall.co.kr/pd/p_pdId=12345
      let productId = '';
      const urlParams = new URLSearchParams(window.location.search);
      productId = urlParams.get('p_pdId') || urlParams.get('pdId') || urlParams.get('goodsNo');
      
      // URL 경로 자체에 번호가 있는 경우 (/pd/12345)
      if (!productId) {
        const match = currentUrl.match(/\/pd\/(\d+)/) || currentUrl.match(/\/product\/(\d+)/);
        if (match && match[1]) {
          productId = match[1];
        }
      }

      // 5. 상세페이지 설명
      let description = '';
      const descEl = document.querySelector('.detail-content') || document.querySelector('#detail');
      if (descEl) {
        description = descEl.innerText.substring(0, 3000);
      }

      // 6. 대표후기 10개 (다이소몰 구조 확인 전까지는 빈 배열)
      const reviews = [];

      return {
        platform: 'DaisoMall',
        productId: productId || 'UNKNOWN',
        productName: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        reviews: reviews,
        productUrl: currentUrl
      };
    } catch (e) {
      console.error("DaisoMall Parse Error:", e);
      return null;
    }
  }
};
