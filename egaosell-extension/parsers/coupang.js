// parsers/coupang.js
window.EgaoParsers = window.EgaoParsers || {};

window.EgaoParsers.coupang = {
  name: "Coupang",
  canParse: (url) => {
    return url.includes('coupang.com/vp/products');
  },
  parse: () => {
    try {
      const titleEl = document.querySelector('h2.prod-buy-header__title');
      const title = titleEl ? titleEl.innerText.trim() : '';

      const priceEl = document.querySelector('span.total-price > strong');
      let priceText = priceEl ? priceEl.innerText : '0';
      const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);

      const imgEl = document.querySelector('img.prod-image__detail');
      let imageUrl = imgEl ? imgEl.getAttribute('src') || imgEl.getAttribute('data-src') : '';
      if (imageUrl && imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      }

      const vendorEl = document.querySelector('.prod-shipping-fee-message');
      const vendorInfo = vendorEl ? vendorEl.innerText.trim() : '';

      return {
        platform: 'Coupang',
        productName: title,
        price: price,
        imageUrl: imageUrl,
        productUrl: window.location.href,
        extraInfo: vendorInfo
      };
    } catch (e) {
      console.error("Coupang Parse Error:", e);
      return null;
    }
  }
};
