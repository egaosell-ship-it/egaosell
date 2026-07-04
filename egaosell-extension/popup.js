// Supabase 설정
const SUPABASE_URL = "https://wbfreqorkvntlboynxbp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kPL7QJcbG_ZHjuOjtXl5Ng_6dA6uMKg";

// supabase-js 글로벌 객체 (CDN에서 로드됨)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    // Chrome Extension의 storage 사용
    storage: {
      getItem: async (key) => {
        const result = await chrome.storage.local.get(key);
        return result[key] || null;
      },
      setItem: async (key, value) => {
        await chrome.storage.local.set({ [key]: value });
      },
      removeItem: async (key) => {
        await chrome.storage.local.remove(key);
      }
    }
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const loadingSection = document.getElementById('loading-section');
  const loginSection = document.getElementById('login-section');
  const mainSection = document.getElementById('main-section');
  
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const collectBtn = document.getElementById('collect-btn');
  const loginError = document.getElementById('login-error');
  const collectStatus = document.getElementById('collect-status');
  const userEmailSpan = document.getElementById('user-email');

  // UI 전환 함수
  const showSection = (section) => {
    loadingSection.classList.add('hidden');
    loginSection.classList.add('hidden');
    mainSection.classList.add('hidden');
    section.classList.remove('hidden');
  };

  // 세션 확인
  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && session.user) {
        userEmailSpan.textContent = session.user.email;
        showSection(mainSection);
      } else {
        showSection(loginSection);
      }
    } catch (err) {
      console.error("Session check error:", err);
      showSection(loginSection);
    }
  };

  await checkSession();

  // 로그인 처리
  loginBtn.addEventListener('click', async () => {
    loginError.classList.add('hidden');
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      loginError.textContent = '이메일과 비밀번호를 입력해주세요.';
      loginError.classList.remove('hidden');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = '로그인 중...';

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    loginBtn.disabled = false;
    loginBtn.textContent = '로그인';

    if (error) {
      loginError.textContent = '로그인 실패: ' + error.message;
      loginError.classList.remove('hidden');
    } else {
      await checkSession();
    }
  });

  // 로그아웃 처리
  logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    showSection(loginSection);
    emailInput.value = '';
    passwordInput.value = '';
  });

  // 상품 수집(크롤링) 처리
  collectBtn.addEventListener('click', async () => {
    collectStatus.classList.remove('hidden');
    collectStatus.className = 'status-msg';
    collectStatus.textContent = '수집 중...';
    collectBtn.disabled = true;

    // 현재 활성화된 탭 정보 가져오기
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const activeTab = tabs[0];
      
      if (!activeTab || !activeTab.id) {
        showCollectStatus('활성화된 탭을 찾을 수 없습니다.', false);
        return;
      }

      // 1. 세션 가져오기 (API 호출용 토큰)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showCollectStatus('세션이 만료되었습니다. 다시 로그인해주세요.', false);
        showSection(loginSection);
        return;
      }

      // 2. Content Script로 메시지 보내 크롤링 실행
      chrome.tabs.sendMessage(activeTab.id, { action: "EXTRACT_PRODUCT_INFO" }, async (response) => {
        if (chrome.runtime.lastError) {
          showCollectStatus('현재 페이지에서 크롤러를 실행할 수 없습니다. (페이지 새로고침 후 다시 시도)', false);
          return;
        }

        if (!response || !response.success) {
          showCollectStatus('상품 정보를 찾을 수 없거나 지원하지 않는 페이지입니다.', false);
          return;
        }

        const productData = response.data;
        collectStatus.textContent = '정보 추출 성공! 서버로 전송 중...';

        // 3. 서버로 데이터 전송 (Background Script 활용이 좋으나, popup에서 직접 전송도 가능)
        // Background로 메시지를 보내 API 통신 위임 (CORS 및 쿠키 문제 방지)
        chrome.runtime.sendMessage({
          action: "SEND_TO_EGAOSELL",
          payload: {
            token: session.access_token,
            productData: productData
          }
        }, (apiResponse) => {
          if (apiResponse && apiResponse.success) {
            showCollectStatus('성공적으로 수집되었습니다!', true);
          } else {
            showCollectStatus(`전송 실패: ${apiResponse?.error || '알 수 없는 오류'}`, false);
          }
        });
      });
    });
  });

  function showCollectStatus(msg, isSuccess) {
    collectStatus.textContent = msg;
    collectStatus.className = `status-msg ${isSuccess ? 'success' : 'error'}`;
    collectBtn.disabled = false;
  }
});
