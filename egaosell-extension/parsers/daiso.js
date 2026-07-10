// parsers/daiso.js
window.EgaoParsers = window.EgaoParsers || {};

window.EgaoParsers.daiso = {
  name: "DaisoMall",
  canParse: (url) => {
    return url.includes('daisomall.co.kr');
  },
  parse: async () => {
    try {
      console.log('[EgaoSell] DaisoMall Parser v3.0 (SSR Direct Fetch) running...');
      const currentUrl = window.location.href;
      
      // 1. 서버에 직접 최신 HTML 요청 (클라이언트 렌더링 지연 완벽 우회)
      const response = await fetch(currentUrl, { cache: "no-store" });
      if (!response.ok) throw new Error("서버에서 HTML을 가져오는데 실패했습니다.");
      const htmlText = await response.text();
      
      // 2. 가상 DOM 생성
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");

      // 3. 목표 상품 ID 추출
      let targetProductId = '';
      const hrefMatch = currentUrl.match(/[?&](?:pdNo|goodsNo|p_pdId)=([^&#]+)/);
      if (hrefMatch && hrefMatch[1]) {
        targetProductId = hrefMatch[1];
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        targetProductId = urlParams.get('p_pdId') || urlParams.get('pdNo') || urlParams.get('goodsNo') || '';
      }
      
      let title = '';
      let price = 0;
      let imageUrl = '';
      let detailImages = [];
      let description = '';
      let productId = targetProductId; 

      // 4. JSON-LD 파싱 (가상 DOM 기반이므로 100% 최신 보장)
      const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
      for (const script of scripts) {
        try {
          const jsonData = JSON.parse(script.innerText);
          if (jsonData['@type'] === 'Product') {
            
            // SSR 기반에서는 sku 매칭 여부가 절대적으로 정확함
            if (targetProductId && jsonData.sku && jsonData.sku !== targetProductId) {
              console.log('[EgaoSell] Invalid JSON-LD sku (SSR mismatch). Skipping...');
              continue;
            }

            if (!title) title = jsonData.name || '';
            if (!imageUrl) imageUrl = jsonData.image || '';
            
            if (jsonData.description) {
              description = jsonData.description.trim();
              console.log('[egaosell-extension] Extracted description from JSON-LD:', description);
            }
            
            if (!productId) productId = jsonData.sku || '';
            
            if (jsonData.offers && jsonData.offers.price) {
              price = parseInt(jsonData.offers.price, 10);
            }
            break;
          }
        } catch (e) {}
      }

      // 5. Fallback: JSON-LD가 없거나 누락된 경우 가상 DOM 요소 활용
      if (!title) {
        const titleElem = doc.querySelector('.goods-title') || doc.querySelector('.pd-name') || doc.querySelector('.title-box .title') || doc.querySelector('p.title') || doc.querySelector('.pd-info .title');
        if (titleElem) {
          title = titleElem.innerText.trim();
        } else {
          const ogTitle = doc.querySelector('meta[property="og:title"]');
          title = ogTitle ? ogTitle.getAttribute('content') : '다이소몰 상품 (제목 파싱 실패)';
        }
      }
      
      if (!imageUrl) {
        const imgElem = doc.querySelector('.swiper-slide-active img') || doc.querySelector('.pd-img img') || doc.querySelector('.main-img img');
        if (imgElem) {
          imageUrl = imgElem.getAttribute('src') || imgElem.getAttribute('data-src') || '';
        } else {
          const ogImage = doc.querySelector('meta[property="og:image"]');
          imageUrl = ogImage ? ogImage.getAttribute('content') : '';
        }
      }

      if (!price || price === 0) {
        const priceElem = doc.querySelector('.price-info .price') || 
                          doc.querySelector('.pd-price') || 
                          doc.querySelector('.sell_price') ||
                          doc.querySelector('.goods-price') ||
                          doc.querySelector('.info-price strong') ||
                          doc.querySelector('.price strong');
                          
        if (priceElem) {
          const priceText = priceElem.innerText.replace(/[^0-9]/g, '');
          if (priceText) {
            price = parseInt(priceText, 10);
          }
        }
      }

      if (!description) {
        const metaDesc = doc.querySelector('meta[property="og:description"]');
        if (metaDesc && metaDesc.getAttribute('content')) {
          description = metaDesc.getAttribute('content').trim();
        }
      }

      if (!title || !imageUrl || title.includes('파싱 실패') || !price || price === 0) {
        throw new Error("상품 페이지 로딩 지연. (서버 응답 불완전)");
      }

      let descriptionDetail = null;

      // 6. 상세 이미지 및 본문 텍스트 추출 (가상 DOM 기반)
      const detailContainer = doc.querySelector('.detail-tab-cont .tab-cont.detail') || doc.querySelector('.editor-area') || doc.querySelector('.detail-content') || doc.querySelector('.product-detail') || doc.querySelector('#detail') || doc.querySelector('.detail-view') || doc.querySelector('.detail-area') || doc.querySelector('.goods-detail');
      
      if (detailContainer) {
        let detailTexts = [];
        const editorAreas = detailContainer.querySelectorAll('.editor-area');
        
        if (editorAreas.length > 0) {
          editorAreas.forEach(area => {
            const text = area.innerText.trim();
            if (text) detailTexts.push(text);
            
            const imgs = area.querySelectorAll('img');
            imgs.forEach(img => {
              const alt = img.getAttribute('alt');
              if (alt) {
                const cleanAlt = alt.trim();
                if (cleanAlt.length > 10 && !cleanAlt.includes('revw') && !cleanAlt.includes('TQC')) {
                  detailTexts.push(cleanAlt);
                }
              }
            });
          });
          const uniqueTexts = Array.from(new Set(detailTexts));
          descriptionDetail = uniqueTexts.join('\n\n').trim();
        } else {
          let innerText = detailContainer.innerText.trim();
          innerText = innerText.replace(/상품설명 더보기/g, '');
          innerText = innerText.replace(/상품정보에 문제가 있나요\?[\s\S]*?신고/g, '');
          innerText = innerText.replace(/상품정보 제공 고시[\s\S]*/, ''); 
          descriptionDetail = innerText.trim();
        }
        
        if (descriptionDetail && descriptionDetail.length > 10000) {
          descriptionDetail = descriptionDetail.substring(0, 10000);
        }

        const imgs = detailContainer.querySelectorAll('img');
        imgs.forEach(img => {
          const src = img.getAttribute('src') || img.getAttribute('data-src');
          if (src && !src.includes('icon') && !src.includes('blank') && !src.includes('banner') && !src.includes('review') && !src.includes('capture')) {
            detailImages.push(src);
          }
        });
      }

      // 특정 컨테이너를 못 찾았을 경우 가상 DOM 전체 탐색
      if (detailImages.length === 0) {
        const allImgs = doc.querySelectorAll('img');
        allImgs.forEach(img => {
          const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
          if (src.includes('/detail/') || src.includes('/content/') || src.includes('/PD/') || src.includes('cdn.daisomall.co.kr/file/')) {
            if (!src.includes('icon') && !src.includes('logo') && !src.includes('banner') && !src.includes('review') && !src.includes('capture') && !src.includes('thumbnail')) {
              detailImages.push(src);
            }
          }
        });

        // 렌더링 지연 방어를 위해 문자열 기반 정규식 추출
        if (detailImages.length === 0) {
          const htmlImgRegex = /(?:<|\\u003C|&lt;)img[^>]*src=\\?["'](https?:\/\/cdn\.daisomall\.co\.kr\/file\/[^"'\\]+\.(?:jpg|jpeg|png|gif))/gi;
          let match;
          let htmlTagsFound = false;
          while ((match = htmlImgRegex.exec(htmlText)) !== null) {
            const matchUrl = match[1];
            if (!matchUrl.includes('icon') && !matchUrl.includes('logo') && !matchUrl.includes('banner') && !matchUrl.includes('review') && !matchUrl.includes('capture') && !matchUrl.includes('thumbnail')) {
              detailImages.push(matchUrl);
              htmlTagsFound = true;
            }
          }

          if (!htmlTagsFound) {
            const rawImgRegex = /https?:\/\/cdn\.daisomall\.co\.kr\/file\/[a-zA-Z0-9_\-\/]+\.(?:jpg|jpeg|png|gif)/gi;
            while ((match = rawImgRegex.exec(htmlText)) !== null) {
              const matchUrl = match[0];
              if (!matchUrl.includes('icon') && !matchUrl.includes('logo') && !matchUrl.includes('banner') 
                  && !matchUrl.includes('thumbnail') && !matchUrl.includes('thumb')) {
                if (matchUrl.includes('/PD/') || matchUrl.includes('/editor/') || matchUrl.includes('/detail/')) {
                  detailImages.push(matchUrl);
                } else if (!matchUrl.includes('/goods/')) { 
                  detailImages.push(matchUrl);
                }
              }
            }
          }
        }
      }

      detailImages = [...new Set(detailImages)];
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
