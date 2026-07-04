// background.js

const API_URL = "http://localhost:3000/api/extension/collect";

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

    // 비동기 처리를 위해 true 반환
    return true;
  }
});
