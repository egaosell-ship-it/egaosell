// content.js

// ---------------------------------------------------------
// 1. 기존: 팝업으로부터 크롤링 명령을 수신하는 리스너
// ---------------------------------------------------------
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "EXTRACT_PRODUCT_INFO") {
    parseProductData().then(productData => {
      if (productData) {
        sendResponse({ success: true, data: productData });
      } else {
        sendResponse({ success: false, error: "지원하지 않는 페이지이거나 상품 정보를 찾을 수 없습니다." });
      }
    });
    return true; // 비동기 응답 지원
  }
});

// 상품 정보 파싱 공통 함수
async function parseProductData() {
  let productData = null;
  const currentUrl = window.location.href;

  if (window.EgaoParsers) {
    for (const parserKey in window.EgaoParsers) {
      const parser = window.EgaoParsers[parserKey];
      if (parser.canParse(currentUrl)) {
        console.log(`[EgaoSell] ${parser.name} 파서로 파싱을 시작합니다.`);
        productData = await parser.parse();
        break;
      }
    }
  }
  return productData;
}


// ---------------------------------------------------------
// ---------------------------------------------------------
// ---------------------------------------------------------
// 2. 스마트스토어 전용: 플로팅 버튼 및 SPA 라우팅 감지 로직
// ---------------------------------------------------------

const FLOATING_BTN_ID = "egao-floating-collect-btn";
let readyCheckTimeout = null; // SPA 렌더링 감지 타이머 (재귀적)

// URL이 스마트스토어 상품 상세 페이지인지 검사
function isSmartstoreProductPage(url) {
  return /smartstore\.naver\.com\/[^\/]+\/products\/\d+/.test(url) || /brand\.naver\.com\/[^\/]+\/products\/\d+/.test(url);
}

// URL이 다이소몰 상품 상세 페이지인지 검사
function isDaisoProductPage(url) {
  // 예: https://www.daisomall.co.kr/pd/p_pdId=... 또는 /product/... 
  // 다이소몰은 주로 daisomall.co.kr 도메인 하위에 상품 관련 식별자가 붙음 (답변 오기 전 범용적으로 매칭)
  return url.includes('daisomall.co.kr/pd/') || url.includes('daisomall.co.kr/product/');
}

// 화면에 플로팅 버튼 주입 (로그인 상태를 인자로 받지 않음)
function injectFloatingButton() {
  let btn = document.getElementById(FLOATING_BTN_ID);
  
  // 버튼이 없으면 새로 생성
  if (!btn) {
    btn = document.createElement("button");
    btn.id = FLOATING_BTN_ID;
    btn.innerText = "EgaoSell 상품수집";
    
    // 버튼 스타일
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "40px",
      right: "40px",
      zIndex: "999999",
      padding: "12px 20px",
      backgroundColor: "#10b981",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.2s"
    });

    btn.addEventListener("mouseover", () => { btn.style.backgroundColor = "#059669"; });
    btn.addEventListener("mouseout", () => { btn.style.backgroundColor = "#10b981"; });

    // 클릭 이벤트
    btn.addEventListener("click", () => {
      // 먼저 로그인 상태를 확인합니다.
      chrome.runtime.sendMessage({ action: "CHECK_LOGIN_STATUS" }, async (response) => {
        if (!response || !response.isLoggedIn || !response.accessToken) {
          alert("EgaoSell에 로그인되어 있지 않습니다! 브라우저 우측 상단의 확장 프로그램(팝업) 아이콘을 눌러 로그인해 주세요.");
          return;
        }

        btn.innerText = "수집 중...";
        btn.disabled = true;
        
        const productData = await parseProductData();
        if (!productData) {
          alert("상품 정보를 파싱할 수 없습니다.");
          resetButton(btn);
          return;
        }

        // 전송을 수행하는 내부 함수
        const sendData = (overwrite = false) => {
          chrome.runtime.sendMessage({
            action: "SEND_TO_EGAOSELL",
            payload: {
              token: response.accessToken,
              productData: productData,
              overwrite: overwrite
            }
          }, (apiResponse) => {
            if (apiResponse && apiResponse.success) {
              alert(overwrite ? "상품이 성공적으로 덮어씌워졌습니다!" : "EgaoSell로 상품 수집이 완료되었습니다!");
              resetButton(btn);
            } else if (apiResponse && apiResponse.isDuplicate) {
              // 중복 상품 알림 및 덮어쓰기 여부 묻기
              if (confirm("이미 동일한 상품이 수집되어 있습니다. 새로운 정보로 덮어씌우시겠습니까?")) {
                btn.innerText = "업데이트 중...";
                sendData(true); // overwrite 옵션을 켜서 재귀 호출
              } else {
                resetButton(btn); // 취소 시 초기화
              }
            } else {
              alert(`전송 실패: ${apiResponse?.error || '알 수 없는 오류'}`);
              resetButton(btn);
            }
          });
        };

        // 첫 번째 전송 시작
        sendData(false);
      });
    });

    document.body.appendChild(btn);
  }

  // 버튼을 무조건 숨긴다.
  btn.style.display = "none";

  // 데이터 로딩 감지 시작
  startReadyCheck();
}

function startReadyCheck() {
  const btn = document.getElementById(FLOATING_BTN_ID);
  if (!btn) return;
  
  if (readyCheckTimeout) {
    clearTimeout(readyCheckTimeout);
    readyCheckTimeout = null;
  }
  
  btn.style.display = "none";
  
  // API Fetch 폭격 방지를 위해 재귀적 setTimeout 사용 (서버 원본 파싱 모드)
  const check = async () => {
    try {
      const productData = await parseProductData();
      if (productData) {
        btn.style.display = "block"; // 완벽하게 추출 가능한 상태일 때 짠! 하고 나타남
        console.log("[EgaoSell] 서버 기반 파싱(SSR) 준비 완료! 버튼 활성화.");
        return; // 성공 시 재귀 종료
      }
    } catch (e) {
      // 파서가 던지는 에러("상품 페이지 로딩 지연") 무시하고 계속 대기
    }
    
    // 실패 시 1초 대기 후 다시 시도 (다이소 서버 부담 경감)
    readyCheckTimeout = setTimeout(check, 1000);
  };

  check();
}

function resetButton(btn) {
  btn.innerText = "EgaoSell 상품수집";
  btn.disabled = false;
}

function removeFloatingButton() {
  if (readyCheckTimeout) {
    clearTimeout(readyCheckTimeout);
    readyCheckTimeout = null;
  }
  const btn = document.getElementById(FLOATING_BTN_ID);
  if (btn) btn.remove();
}

// 페이지 상태를 검사하여 버튼을 렌더링하거나 제거
function checkAndRenderButton() {
  const currentUrl = window.location.href;
  
  if (isSmartstoreProductPage(currentUrl) || isDaisoProductPage(currentUrl)) {
    // 상품 페이지라면 무조건 버튼을 그립니다. (로그인은 클릭 시 검사)
    injectFloatingButton();
  } else {
    // 상품 페이지가 아니면 제거
    removeFloatingButton();
  }
}

// 초기 로드시 1회 검사
checkAndRenderButton();

// Background에서 SPA 라우팅으로 인한 URL 변경 메시지를 수신
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "URL_CHANGED") {
    // 약간의 딜레이를 주어 DOM이 새 페이지로 업데이트될 시간을 확보
    setTimeout(() => {
      checkAndRenderButton();
    }, 500);
  }
});
