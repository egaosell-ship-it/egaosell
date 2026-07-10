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
      
      let title = '';
      let price = 0;
      let imageUrl = '';
      let description = '';
      let productId = '';

      // 1. JSON-LD 파싱 (가장 정확한 데이터)
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of scripts) {
        try {
          const jsonData = JSON.parse(script.innerText);
          if (jsonData['@type'] === 'Product') {
            title = jsonData.name || '';
            imageUrl = jsonData.image || '';
            description = jsonData.description || '';
            productId = jsonData.sku || '';
            if (jsonData.offers && jsonData.offers.price) {
              price = parseInt(jsonData.offers.price, 10);
            }
            break;
          }
        } catch (e) {
          // JSON 파싱 에러 무시
        }
      }

      // 2. Fallback: JSON-LD가 없거나 일부 누락된 경우 og 태그 활용
      if (!title) {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        title = ogTitle ? ogTitle.getAttribute('content') : '다이소몰 상품 (제목 파싱 실패)';
      }
      
      if (!imageUrl) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        imageUrl = ogImage ? ogImage.getAttribute('content') : '';
      }

      if (!productId) {
        const urlParams = new URLSearchParams(window.location.search);
        productId = urlParams.get('p_pdId') || urlParams.get('pdNo') || urlParams.get('goodsNo');
      }

      // 3. 리뷰 (임시 빈 배열)
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
