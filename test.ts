import { convertOrderData } from './src/lib/orderConversion';

const inputText = `송효섭	김효섭	N		N		2	블랙:260/2개						24900	24900	9000-도매왕국[A-29]		010-4712-5544	031-796-0792	N	12909	경기도 하남시 미사강변대로 240, 808-1102 (망월동, 미사강변도시8단지)	"빠른배송부탁드립니다."`;

const store = {
  platformName: "ESM",
  siteName: "액션",
  invoicePromo1: "네이버에서[액션런]검색",
  invoicePromo2: "구글에서[액션런]검색"
};

const setting = {
  platformName: "ESM",
  supplierNameDelimiter1: "["
};

const result = convertOrderData(inputText, store as any, setting as any);
console.log(result);
