// parsers/daiso.js
window.EgaoParsers = window.EgaoParsers || {};

window.EgaoParsers.daiso = {
  name: "DaisoMall",
  canParse: (url) => {
    return url.includes('daisomall.co.kr');
  },
  parse: () => {
    try {
      console.log('[SellerSuite] DaisoMall Parser v2.1 running...');
      const currentUrl = window.location.href;
      
      let title = '';
      let price = 0;
      let imageUrl = '';
      let detailImages = [];
      let description = '';
      let productId = '';

      // 2.5 Meta Description 태그 파싱 (사용자 요청에 따라 og:description 사용)
      const metaDesc = document.querySelector('meta[property="og:description"]');
      if (metaDesc && metaDesc.getAttribute('content')) {
        description = metaDesc.getAttribute('content').trim();
        console.log('[egaosell-extension] Extracted og:description:', description);
      }

      // JSON-LD 파싱 (가장 정확한 데이터, 다만 description은 위에서 뽑은걸 우선시함)
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of scripts) {
        try {
          const jsonData = JSON.parse(script.innerText);
          if (jsonData['@type'] === 'Product') {
            title = jsonData.name || '';
            imageUrl = jsonData.image || '';
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

      // Fallback: JSON-LD가 없거나 일부 누락된 경우 og 태그 활용
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

      let descriptionDetail = null;

      // 3. 상세 이미지 및 본문 텍스트 추출 (본문 영역)
      const detailContainer = document.querySelector('.detail-tab-cont .tab-cont.detail') || document.querySelector('.editor-area') || document.querySelector('.detail-content') || document.querySelector('.product-detail') || document.querySelector('#detail') || document.querySelector('.detail-view') || document.querySelector('.detail-area') || document.querySelector('.goods-detail');
      
      if (detailContainer) {
        // 본문 텍스트 추출 (순수 자연어 상세 설명 - .editor-area 내부만 긁어옴)
        let detailTexts = [];
        const editorAreas = detailContainer.querySelectorAll('.editor-area');
        
        if (editorAreas.length > 0) {
          editorAreas.forEach(area => {
            // 1. 화면에 보이는 텍스트 노드 추출
            const text = area.innerText.trim();
            if (text) detailTexts.push(text);
            
            // 2. 다이소몰 특성상 '이미지의 alt 속성'에 전체 설명 텍스트를 숨겨두는 경우가 많음
            const imgs = area.querySelectorAll('img');
            imgs.forEach(img => {
              const alt = img.getAttribute('alt');
              if (alt) {
                const cleanAlt = alt.trim();
                // 짧은 아이콘 이름이나 쓰레기 값 제외, 의미 있는 길이의 텍스트만 본문으로 취급
                if (cleanAlt.length > 10 && !cleanAlt.includes('revw') && !cleanAlt.includes('TQC')) {
                  detailTexts.push(cleanAlt);
                }
              }
            });
          });
          descriptionDetail = detailTexts.join('\n\n').trim();
          console.log('[SellerSuite] Extracted descriptionDetail from .editor-area (Text+Alt Length):', descriptionDetail.length);
        } else {
          // editor-area가 없을 경우 fallback으로 정규식 방식 사용
          let innerText = detailContainer.innerText.trim();
          innerText = innerText.replace(/상품설명 더보기/g, '');
          innerText = innerText.replace(/상품정보에 문제가 있나요\?[\s\S]*?신고/g, '');
          innerText = innerText.replace(/상품정보 제공 고시[\s\S]*/, ''); 
          descriptionDetail = innerText.trim();
          console.log('[SellerSuite] Extracted descriptionDetail using fallback regex (Length):', descriptionDetail.length);
        }
        
        if (descriptionDetail && descriptionDetail.length > 10000) {
          descriptionDetail = descriptionDetail.substring(0, 10000); // 최대 1만자 제한
        }

        // 본문 내 모든 이미지 추출
        const imgs = detailContainer.querySelectorAll('img');
        imgs.forEach(img => {
          const src = img.getAttribute('src') || img.getAttribute('data-src');
          if (src && !src.includes('icon') && !src.includes('blank') && !src.includes('banner') && !src.includes('review') && !src.includes('capture')) {
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
            if (!src.includes('icon') && !src.includes('logo') && !src.includes('banner') && !src.includes('review') && !src.includes('capture') && !src.includes('thumbnail')) {
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
            if (!matchUrl.includes('icon') && !matchUrl.includes('logo') && !matchUrl.includes('banner') && !matchUrl.includes('review') && !matchUrl.includes('capture') && !matchUrl.includes('thumbnail')) {
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
        descriptionDetail: descriptionDetail,
        reviews: reviews,
        productUrl: currentUrl
      };
    } catch (e) {
      console.error("DaisoMall Parse Error:", e);
      return null;
    }
  }
};
