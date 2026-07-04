// test-proxy.ts
// 실행 방법: npx ts-node test-proxy.ts

import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch'; // TypeScript에서 기본 fetch에 Agent를 넘기기 어려울 수 있어 node-fetch 사용.

// ==========================================
// [필수 입력] 아래 3가지 항목을 수정해 주세요!
// ==========================================
const PROXY_IP = "203.245.41.124";  // 카페24 가상서버 IP 주소
const PROXY_PORT = "3128";           // 프록시 포트 (예: 8080, 3128)
// 인증 아이디/비밀번호가 있다면 'username:password@' 형태로 앞에 붙여주세요. (없다면 비워둡니다)
const PROXY_AUTH = "egaosell:a753951ssAA@";

async function testProxyConnection() {
  const proxyUrl = `http://${PROXY_AUTH}${PROXY_IP}:${PROXY_PORT}`;
  console.log(`[1] 설정된 프록시 서버: ${proxyUrl}`);
  console.log(`[2] 프록시 연결 테스트를 시작합니다... (목적지: https://api.ipify.org)`);

  const agent = new HttpsProxyAgent(proxyUrl);

  try {
    // api.ipify.org 는 현재 내 외부 인터넷 IP를 알려주는 사이트입니다.
    const response = await fetch('https://api.ipify.org?format=json', {
      agent: agent
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`\n✅ 통신 성공!`);
    console.log(`✅ 현재 외부로 노출되는 IP는: [ ${data.ip} ] 입니다.`);

    if (data.ip === PROXY_IP) {
      console.log(`🎉 축하합니다! 프록시를 통해 통신이 완벽하게 이루어지고 있습니다.`);
      console.log(`👉 이 IP(${data.ip})를 쿠팡/네이버 API 센터에 등록하시면 됩니다.`);
    } else {
      console.log(`⚠️ 프록시를 통과했지만 IP가 설정한 값과 다릅니다. 확인이 필요합니다.`);
    }

  } catch (error: any) {
    console.error(`\n❌ 프록시 연결 실패!`);
    console.error(`에러 내용: ${error.message}`);
    console.error(`\n💡 해결 팁:`);
    console.error(`1. 카페24 서버의 방화벽(Inbound Rules)에서 포트(${PROXY_PORT})가 열려있는지 확인하세요.`);
    console.error(`2. 카페24 서버 내의 프록시 프로그램(squid, 3proxy 등)이 켜져 있는지 확인하세요.`);
    console.error(`3. IP와 포트 번호 오타가 없는지 확인하세요.`);
  }
}

testProxyConnection();
