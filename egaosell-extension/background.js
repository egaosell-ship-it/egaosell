// background.js

const API_URL = "http://localhost:3000/api/extension/collect";
const SUPABASE_STORAGE_KEY = "sb-wbfreqorkvntlboynxbp-auth-token";

// SPA 라우팅 감지하여 Content Script에 알림
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      action: "URL_CHANGED",
      url: changeInfo.url
    }).catch(() => {
      // Content script가 아직 로드되지 않은 탭의 경우 발생하는 에러 무시
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SEND_TO_EGAOSELL") {
    const { token, productData } = request.payload;

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        ...productData,
        overwrite: request.payload.overwrite // 추가된 덮어쓰기 플래그
      })
    })
    .then(async (res) => {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        const errorText = await res.text();
        console.error("HTML Error Response:", errorText);
        throw new Error("서버에서 JSON이 아닌 HTML(에러 페이지)을 반환했습니다. EgaoSell 개발 서버 터미널(터미널 창)에 컴파일 에러나 다른 오류가 떠있는지 확인해 주세요!");
      }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`서버 에러 (${res.status}): ${errorText}`);
      }
      return res.json();
    })
    .then((data) => {
      sendResponse({ success: true, data });
    })
    .catch((error) => {
      console.error("API 전송 실패:", error);
      sendResponse({ success: false, error: error.message });
    });

    return true; // 비동기 응답 지원
  }

  // 로그인 상태 확인 요청 처리
  if (request.action === "CHECK_LOGIN_STATUS") {
    // Supabase auth.persistSession: true 일 경우, 저장소에 해당 토큰이 존재하는지 확인
    chrome.storage.local.get(null, (items) => {
      let isLoggedIn = false;
      let accessToken = null;

      // storage.local에 저장된 키들을 순회하며 supabase session 정보가 있는지 찾음
      for (const key in items) {
        if (key.includes('-auth-token')) {
          try {
            // Supabase 스토리지 어댑터는 value를 문자열로 넘겨줍니다. JSON 파싱이 필요합니다.
            let sessionData = items[key];
            if (typeof sessionData === 'string') {
              sessionData = JSON.parse(sessionData);
            }
            
            if (sessionData && sessionData.access_token) {
              isLoggedIn = true;
              accessToken = sessionData.access_token;
              break;
            }
          } catch(e) {
            console.error("세션 파싱 에러:", e);
          }
        }
      }
      sendResponse({ isLoggedIn, accessToken });
    });

    return true; // 비동기 응답 지원
  }
});
