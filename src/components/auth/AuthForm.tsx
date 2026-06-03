'use client';

import { useState, useTransition } from 'react';
import { loginAction, signUpAction, oAuthLoginAction } from '@/app/actions/auth.actions';

export default function AuthForm() {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      let result;
      if (view === 'login') {
        result = await loginAction(formData);
      } else {
        result = await signUpAction(formData);
      }
      
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  const handleOAuth = (provider: 'google' | 'kakao' | 'naver') => {
    startTransition(async () => {
      const result = await oAuthLoginAction(provider);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <main className="w-full max-w-[400px] px-margin-mobile md:px-0">
      {/* Brand Header */}
      <div className="flex flex-col items-center justify-center mb-lg">
        <div className="flex items-center gap-2 mb-sm">
          <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            dataset
          </span>
          <span className="font-headline-md text-headline-md text-on-surface tracking-tight">egaoSell</span>
        </div>
        <p className="font-body-sm text-body-sm text-secondary text-center">
          {view === 'login' ? '이커머스 관리를 위한 최적의 솔루션' : '새로운 계정을 만들어 비즈니스를 확장하세요'}
        </p>
      </div>

      {/* Card Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Toggle Tabs */}
        <div className="flex border-b border-outline-variant bg-surface-container-low/50">
          <button
            onClick={() => { setView('login'); setError(null); }}
            className={`flex-1 py-3 text-center font-label-md text-label-md transition-colors cursor-pointer ${
              view === 'login'
                ? 'bg-surface-container-lowest border-b-2 border-primary text-primary'
                : 'text-secondary hover:text-on-surface border-b-2 border-transparent'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => { setView('signup'); setError(null); }}
            className={`flex-1 py-3 text-center font-label-md text-label-md transition-colors cursor-pointer ${
              view === 'signup'
                ? 'bg-surface-container-lowest border-b-2 border-primary text-primary'
                : 'text-secondary hover:text-on-surface border-b-2 border-transparent'
            }`}
          >
            회원가입
          </button>
        </div>

        <div className="p-md md:p-lg">
          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded text-sm font-medium">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
            {/* Name Field (Only visible on Sign Up) */}
            {view === 'signup' && (
              <div className="flex flex-col gap-base">
                <label htmlFor="name" className="font-label-md text-label-md text-on-surface-variant">이름</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="홍길동"
                  className="w-full h-[36px] px-sm bg-surface-container-lowest border border-outline-variant rounded font-body-sm text-body-sm text-on-surface input-focus-ring transition-all placeholder:text-outline"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-base">
              <label htmlFor="email" className="font-label-md text-label-md text-on-surface-variant">이메일 주소</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@company.com"
                required
                className="w-full h-[36px] px-sm bg-surface-container-lowest border border-outline-variant rounded font-body-sm text-body-sm text-on-surface input-focus-ring transition-all placeholder:text-outline"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-base">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="font-label-md text-label-md text-on-surface-variant">비밀번호</label>
                {view === 'login' && (
                  <a href="#" className="font-label-sm text-label-sm text-primary hover:text-primary-fixed-variant transition-colors">
                    비밀번호 찾기
                  </a>
                )}
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full h-[36px] px-sm bg-surface-container-lowest border border-outline-variant rounded font-body-sm text-body-sm text-on-surface input-focus-ring transition-all placeholder:text-outline"
              />
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-[36px] mt-2 bg-primary-container text-on-primary font-label-md text-label-md rounded flex items-center justify-center hover:bg-surface-tint transition-colors disabled:opacity-50"
            >
              {isPending ? '처리중...' : (view === 'login' ? '로그인' : '계정 생성하기')}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-md">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="px-sm font-label-sm text-label-sm text-secondary uppercase tracking-widest">또는</span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-xs">
            <button
              onClick={() => handleOAuth('google')}
              disabled={isPending}
              className="w-full h-[36px] bg-surface-container-lowest border border-outline-variant text-on-surface rounded font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              Google 계정으로 계속
            </button>
            <button
              onClick={() => handleOAuth('kakao')}
              disabled={isPending}
              className="w-full h-[36px] bg-surface-container-lowest border border-outline-variant text-on-surface rounded font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors disabled:opacity-50"
            >
              <div className="w-3 h-3 rounded-full bg-[#FEE500]"></div>
              Kakao로 계속
            </button>
            <button
              onClick={() => handleOAuth('naver')}
              disabled={isPending}
              className="w-full h-[36px] bg-surface-container-lowest border border-outline-variant text-on-surface rounded font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors disabled:opacity-50"
            >
              <div className="w-3 h-3 rounded-full bg-[#03C75A]"></div>
              Naver로 계속
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Minimal Links */}
      <div className="mt-lg flex justify-center gap-sm font-label-sm text-label-sm text-secondary">
        <a href="#" className="hover:text-primary transition-colors">이용약관</a>
        <span>•</span>
        <a href="#" className="hover:text-primary transition-colors">개인정보처리방침</a>
        <span>•</span>
        <a href="#" className="hover:text-primary transition-colors">고객지원</a>
      </div>
    </main>
  );
}
