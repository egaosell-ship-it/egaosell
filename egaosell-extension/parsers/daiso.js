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
      let detailImages = [];
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

      // 3. 상세 이미지 추출 (본문 영역)
      // 다이소몰의 상세페이지가 위치하는 영역(추정 클래스: .detail-content, .detail-view, #detail 등)을 탐색
      const detailContainer = document.querySelector('.detail-content') || document.querySelector('.product-detail') || document.querySelector('#detail') || document.querySelector('.detail-view');
      
      if (detailContainer) {
        // 본문 텍스트 추출 (JSON-LD보다 우선 혹은 병합)
        const innerText = detailContainer.innerText.trim();
        if (innerText.length > 50) {
          description = innerText.substring(0, 5000); // 최대 5000자 제한
        }

        // 본문 내 모든 이미지 추출
        const imgs = detailContainer.querySelectorAll('img');
        imgs.forEach(img => {
          const src = img.getAttribute('src') || img.getAttribute('data-src');
          if (src && !src.includes('icon') && !src.includes('blank')) {
            detailImages.push(src);
          }
        });
      } else {
        // 특정 컨테이너를 못 찾을 경우, 페이지 내 큰 이미지들을 수집해본다 (휴리스틱)
        // 보통 썸네일은 크기가 작고 상세이미지는 크므로, 로딩된 이미지 중 width 속성이나 자연크기가 큰 것.
        // 또는 src에 'detail', 'content' 가 들어간 것.
        const allImgs = document.querySelectorAll('img');
        allImgs.forEach(img => {
          const src = img.getAttribute('src') || '';
          // 다이소 특정 패턴이나 단순 width 필터링 적용 (여기선 패턴 필터링 예시)
          if (src.includes('/detail/') || src.includes('/content/')) {
            detailImages.push(src);
          }
        });
      }

      // 중복 제거
      detailImages = [...new Set(detailImages)];

      // 4. 리뷰 (임시 빈 배열)
      const reviews = [];

      return {
        platform: 'DaisoMall',
        productId: productId || 'UNKNOWN',
        productName: title,
        price: price,
        imageUrl: imageUrl,
        detailImages: detailImages,
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
