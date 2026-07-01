import crypto from 'crypto';

export class CoupangApiService {
  private accessKey: string;
  private secretKey: string;
  private vendorCode: string;
  private baseUrl = 'https://api-gateway.coupang.com';

  constructor(vendorCode: string, accessKey: string, secretKey: string) {
    this.vendorCode = vendorCode;
    this.accessKey = accessKey;
    this.secretKey = secretKey;
  }

  /**
   * 쿠팡 API용 날짜 포맷 (YYMMDD'T'HHMMSS'Z')
   */
  private getCoupangDateString(): string {
    const date = new Date();
    const yy = String(date.getUTCFullYear()).slice(-2);
    const MM = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return `${yy}${MM}${dd}T${hh}${mm}${ss}Z`;
  }

  /**
   * HMAC-SHA256 인증 헤더 생성
   */
  private generateAuthorizationHeader(method: string, uri: string): string {
    const datetime = this.getCoupangDateString();
    // 쿠팡 규격: URI에 포함된 쿼리스트링 시작문자(?)는 제외하고 문자열 연결
    const signatureUri = uri.replace('?', '');
    const message = datetime + method + signatureUri;
    const signature = crypto.createHmac('sha256', this.secretKey).update(message).digest('hex');
    
    return `CEA algorithm=HmacSHA256, access-key=${this.accessKey}, signed-date=${datetime}, signature=${signature}`;
  }

  /**
   * 상품 목록 조회 테스트
   */
  public async getSellerProducts() {
    const method = 'GET';
    const uri = `/v2/providers/seller_api/apis/api/v1/marketplace/seller-products?vendorId=${this.vendorCode}`;
    const url = `${this.baseUrl}${uri}`;

    const authorization = this.generateAuthorizationHeader(method, uri);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': authorization,
          'Content-Type': 'application/json;charset=UTF-8',
          'X-Requested-By': this.vendorCode,
        },
        cache: 'no-store'
      });

      const responseData = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        data: responseData
      };
    } catch (error: any) {
      return {
        success: false,
        status: 500,
        error: error.message || 'Unknown error occurred while fetching Coupang API'
      };
    }
  }
}
