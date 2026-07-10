// background.js

const API_URL = "http://localhost:3000/api/extension/collect";
const SUPABASE_URL = "https://wbfreqorkvntlboynxbp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kPL7QJcbG_ZHjuOjtXl5Ng_6dA6uMKg";
const SUPABASE_STORAGE_KEY = "sb-wbfreqorkvntlboynxbp-auth-token";

// Supabase Token 강제 갱신 함수
async function refreshAuthToken(refreshToken) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`토큰 갱신 실패: ${errText}`);
  }

  const data = await response.json();
  
  // 성공 시 새로운 세션을 로컬 스토리지에 덮어씀 (EgaoSell 본진과 싱크)
  await new Promise((resolve) => {
    chrome.storage.local.set({ [SUPABASE_STORAGE_KEY]: JSON.stringify(data) }, resolve);
  });
  
  return data.access_token;
}

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
    const { token, productData, overwrite } = request.payload;

    async function doFetch(currentToken, isRetry = false) {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentToken}`
        },
        body: JSON.stringify({ ...productData, overwrite })
      });

      // 토큰 만료(401) 시 1회에 한하여 자동 갱신 및 재시도
      if (res.status === 401 && !isRetry) {
        console.log("[EgaoSell] Token expired (401). Attempting silent refresh...");
        
        // 스토리지에서 refresh_token 추출
        const items = await new Promise(resolve => chrome.storage.local.get(null, resolve));
        let sessionData = null;
        for (const key in items) {
          if (key.includes('-auth-token')) {
            try {
              sessionData = typeof items[key] === 'string' ? JSON.parse(items[key]) : items[key];
              break;
            } catch(e) {}
          }
        }
        
        if (sessionData && sessionData.refresh_token) {
          try {
            const newAccessToken = await refreshAuthToken(sessionData.refresh_token);
            console.log("[EgaoSell] Silent refresh successful! Retrying request...");
            // 갱신된 토큰으로 재시도
            return await doFetch(newAccessToken, true);
          } catch (refreshErr) {
            console.error("[EgaoSell] Refresh failed:", refreshErr);
            throw new Error(`유효하지 않거나 만료된 토큰입니다. (다시 로그인 해주세요)`);
          }
        } else {
          throw new Error(`유효하지 않거나 만료된 토큰입니다. (재발급 불가, 다시 로그인 해주세요)`);
        }
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        const errorText = await res.text();
        console.error("HTML Error Response:", errorText);
        throw new Error("서버에서 JSON이 아닌 HTML(에러 페이지)을 반환했습니다. EgaoSell 개발 서버를 확인해 주세요!");
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`서버 에러 (${res.status}): ${errorText}`);
      }
      
      return await res.json();
    }

    doFetch(token)
      .then((data) => {
        sendResponse(data);
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
