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
      const detailContainer = document.querySelector('.detail-content') || document.querySelector('.product-detail') || document.querySelector('#detail') || document.querySelector('.detail-view') || document.querySelector('.detail-area') || document.querySelector('.goods-detail');
      
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
      }

      // 특정 컨테이너를 못 찾았거나 컨테이너 내 이미지가 없는 경우 휴리스틱 및 HTML 정규식 탐색
      if (detailImages.length === 0) {
        const allImgs = document.querySelectorAll('img');
        allImgs.forEach(img => {
          const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
          if (src.includes('/detail/') || src.includes('/content/') || src.includes('/PD/') || src.includes('cdn.daisomall.co.kr/file/')) {
            if (!src.includes('icon') && !src.includes('logo') && !src.includes('banner')) {
              detailImages.push(src);
            }
          }
        });

        // 렌더링 지연(SPA)으로 인해 DOM에 이미지가 없을 경우, 문서 전체 소스(Nuxt state)에서 정규식 추출
        if (detailImages.length === 0) {
          const htmlStr = document.documentElement.innerHTML;
          
          // 1단계: HTML 태그 속성 (src="...") 안에 있는 이미지 우선 추출 (JSON 내 상세설명 HTML 타겟팅)
          // <img src="..."> 형태나 이스케이프된 \u003Cimg src=\"...\" 형태를 모두 커버
          const htmlImgRegex = /(?:<|\\u003C|&lt;)img[^>]*src=\\?["'](https?:\/\/cdn\.daisomall\.co\.kr\/file\/[^"'\\]+\.(?:jpg|jpeg|png|gif))/gi;
          let match;
          let htmlTagsFound = false;
          while ((match = htmlImgRegex.exec(htmlStr)) !== null) {
            const matchUrl = match[1]; // 캡처 그룹 1
            if (!matchUrl.includes('icon') && !matchUrl.includes('logo') && !matchUrl.includes('banner')) {
              detailImages.push(matchUrl);
              htmlTagsFound = true;
            }
          }

          // 2단계: 태그 구조를 못 찾았다면 전체 URL 매칭하되 연관상품(썸네일) 강력 제외
          if (!htmlTagsFound) {
            const rawImgRegex = /https?:\/\/cdn\.daisomall\.co\.kr\/file\/[a-zA-Z0-9_\-\/]+\.(?:jpg|jpeg|png|gif)/gi;
            while ((match = rawImgRegex.exec(htmlStr)) !== null) {
              const matchUrl = match[0];
              if (!matchUrl.includes('icon') && !matchUrl.includes('logo') && !matchUrl.includes('banner') 
                  && !matchUrl.includes('thumbnail') && !matchUrl.includes('thumb')) {
                // 확실한 상세 이미지 경로
                if (matchUrl.includes('/PD/') || matchUrl.includes('/editor/') || matchUrl.includes('/detail/')) {
                  detailImages.push(matchUrl);
                } else if (!matchUrl.includes('/goods/')) { // 썸네일 확률이 높은 /goods/ 제외
                  detailImages.push(matchUrl);
                }
              }
            }
          }
        }
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
