import bcrypt from 'bcryptjs';

export class NaverApiService {
  private appId: string;
  private appSecret: string;
  private baseUrl = 'https://api.commerce.naver.com/external';

  constructor(appId: string, appSecret: string) {
    this.appId = appId;
    this.appSecret = appSecret;
  }

  /**
   * 네이버 커머스 API 토큰 발급용 서명 생성
   */
  private async generateClientSecretSign(timestamp: number): Promise<string> {
    const password = `${this.appId}_${timestamp}`;
    
    // bcrypt 해싱 (salt rounds를 지정하여 hash 생성. 네이버 규격은 일반적인 bcrypt 방식)
    // bcrypt.hash() 결과가 바로 client_secret_sign (하지만 네이버는 앱 시크릿을 salt처럼 사용하여 원문을 해싱하는 특별한 구조를 사용한다. 또는 앱 시크릿 자체가 salt이다.)
    
    // 네이버 커머스 API 서명 생성 가이드라인: 
    // "client_secret 값을 그대로 비밀번호로 사용하여 client_id_timestamp 문자열을 Bcrypt로 해싱한 값의 base64 인코딩"
    // 그런데 JavaScript/Node.js의 bcrypt는 앱 시크릿 자체를 salt로 바로 쓸 수 없으므로, (포맷이 맞지 않음) 
    // bcryptjs 모듈을 사용하여 비밀번호=client_id_timestamp, salt=app_secret 로 해싱한다.
    
    // appSecret이 이미 올바른 bcrypt salt 포맷이어야 한다. (네이버 발급 시크릿은 보통 $2a$10$ 형태를 포함함)
    
    try {
      const hashed = await bcrypt.hash(password, this.appSecret);
      // base64로 인코딩
      return Buffer.from(hashed).toString('base64');
    } catch (error: any) {
      throw new Error(`Signature Generation Failed: ${error.message}`);
    }
  }

  /**
   * 엑세스 토큰 발급
   */
  public async getAccessToken(): Promise<string> {
    const timestamp = Date.now();
    const signature = await this.generateClientSecretSign(timestamp);

    const url = `${this.baseUrl}/v1/oauth2/token`;
    
    const params = new URLSearchParams();
    params.append('client_id', this.appId);
    params.append('timestamp', timestamp.toString());
    params.append('client_secret_sign', signature);
    params.append('grant_type', 'client_credentials');
    params.append('type', 'SELF');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get Naver Access Token');
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * 상품 목록(원상품) 조회 테스트 (연동 성공 여부 확인)
   */
  public async getOriginProductsTest() {
    try {
      // 1. 토큰 발급
      const accessToken = await this.getAccessToken();

      // 2. 원상품 목록 조회 API 요청
      // v2 원상품 목록 조회 엔드포인트
      // 문서 참고: https://apicenter.commerce.naver.com/docs/commerce-api/current/read-origin-product-product
      // 이 URL은 단건 조회인 경우 파라미터가 필요하므로, 간단한 목록 조회나 내 정보 조회 등으로 대체
      const url = `${this.baseUrl}/v1/seller/channels`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
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
        error: error.message || 'Unknown error occurred while fetching Naver API'
      };
    }
  }
}
