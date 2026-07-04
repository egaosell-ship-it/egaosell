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
      body: JSON.stringify(productData)
    })
    .then(async (res) => {
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
      // 기본적으로 커스텀 storage setItem 구현에서 키를 그대로 쓰므로 원래 키 모양을 찾아야 함
      // (popup.js에서 auth.storage로 설정한 키)
      for (const key in items) {
        if (key.includes('-auth-token')) {
          try {
            const sessionData = items[key];
            if (sessionData && sessionData.access_token) {
              isLoggedIn = true;
              accessToken = sessionData.access_token;
              break;
            }
          } catch(e) {}
        }
      }
      sendResponse({ isLoggedIn, accessToken });
    });

    return true; // 비동기 응답 지원
  }
});
