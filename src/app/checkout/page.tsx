"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { initiatePayment } from "@/app/actions/billing.actions";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [payment, setPayment] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchPayment() {
      try {
        // 환경 변수에서 클라이언트 키를 불러옵니다.
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) {
          throw new Error("NEXT_PUBLIC_TOSS_CLIENT_KEY 환경 변수가 설정되지 않았습니다.");
        }
        const tossPayments = await loadTossPayments(clientKey);
        
        // 비회원 결제 테스트 객체 생성
        // type definition 상 ANONYMOUS 상수가 없으면 문자열 직접 사용
        const paymentInstance = tossPayments.payment({
          customerKey: "test_customer_12345",
        });
        
        setPayment(paymentInstance);
      } catch (error) {
        console.error("Error fetching payment:", error);
      }
    }
    fetchPayment();
  }, []);

  async function handlePayment() {
    if (!payment) {
      alert("결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    const methodMap: Record<string, string> = {
      card: "CARD",
      easy: "TOSSPAY",
      transfer: "TRANSFER"
    };

    try {
      // 빌링키 발급을 위한 인증 요청 (카드 정기결제)
      // 주의: 일반적인 빌링은 CARD 메서드를 주로 사용합니다.
      await payment.requestBillingAuth({
        method: methodMap[paymentMethod] === "CARD" ? "CARD" : "CARD", // 빌링은 주로 CARD 사용
        successUrl: window.location.origin + "/success",
        failUrl: window.location.origin + "/fail",
        customerEmail: "hong@sellersuite.kr",
        customerName: "홍길동",
      });
    } catch (error) {
      console.error("Billing Auth Error:", error);
      setIsProcessing(false);
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <main className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-12">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-secondary hover:text-primary transition-colors text-sm font-medium mb-4 group"
          >
            <span className="material-symbols-outlined text-[18px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            돌아가기
          </button>
          <h1 className="text-3xl md:text-4xl font-bold">결제하기</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-8 pb-4 border-b border-surface-variant">결제수단 선택</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <label className={`cursor-pointer relative border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-colors ${paymentMethod === 'card' ? 'border-primary bg-surface' : 'border-surface-variant bg-surface-container-lowest hover:bg-surface-container-low'}`}>
                  <input 
                    className="sr-only peer" 
                    name="payment_method" 
                    type="radio" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <span className={`material-symbols-outlined text-[24px] ${paymentMethod === 'card' ? 'text-primary' : 'text-secondary'}`}>credit_card</span>
                  <span className="text-sm font-medium text-on-surface">신용/체크카드</span>
                  {paymentMethod === 'card' && (
                    <div className="absolute top-2 right-2 text-primary">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                </label>

                <label className={`cursor-pointer relative border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-colors ${paymentMethod === 'easy' ? 'border-primary bg-surface' : 'border-surface-variant bg-surface-container-lowest hover:bg-surface-container-low'}`}>
                  <input 
                    className="sr-only peer" 
                    name="payment_method" 
                    type="radio" 
                    value="easy"
                    checked={paymentMethod === 'easy'}
                    onChange={() => setPaymentMethod('easy')}
                  />
                  <span className={`material-symbols-outlined text-[24px] ${paymentMethod === 'easy' ? 'text-primary' : 'text-secondary'}`}>account_balance_wallet</span>
                  <span className="text-sm font-medium text-on-surface">간편결제 (Toss)</span>
                  {paymentMethod === 'easy' && (
                    <div className="absolute top-2 right-2 text-primary">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                </label>

                <label className={`cursor-pointer relative border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-colors ${paymentMethod === 'transfer' ? 'border-primary bg-surface' : 'border-surface-variant bg-surface-container-lowest hover:bg-surface-container-low'}`}>
                  <input 
                    className="sr-only peer" 
                    name="payment_method" 
                    type="radio" 
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                  />
                  <span className={`material-symbols-outlined text-[24px] ${paymentMethod === 'transfer' ? 'text-primary' : 'text-secondary'}`}>account_balance</span>
                  <span className="text-sm font-medium text-on-surface">계좌이체</span>
                  {paymentMethod === 'transfer' && (
                    <div className="absolute top-2 right-2 text-primary">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">카드사 선택</label>
                    <select className="w-full border-surface-variant rounded-lg bg-surface-container-lowest text-sm p-2 focus:ring-1 focus:ring-primary-container focus:border-primary-container h-10">
                      <option>신한카드</option>
                      <option>국민카드</option>
                      <option>현대카드</option>
                      <option>삼성카드</option>
                      <option>기타</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">할부기간</label>
                    <select className="w-full border-surface-variant rounded-lg bg-surface-container-lowest text-sm p-2 focus:ring-1 focus:ring-primary-container focus:border-primary-container h-10">
                      <option>일시불</option>
                      <option>2개월 무이자</option>
                      <option>3개월 무이자</option>
                      <option>6개월</option>
                    </select>
                  </div>
                </div>
              )}
            </section>

            <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-8 pb-4 border-b border-surface-variant">결제자 정보</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-secondary mb-2">이름</label>
                    <input className="w-full border-surface-variant rounded-lg bg-surface-container-lowest text-sm p-2 focus:ring-1 focus:ring-primary-container focus:border-primary-container h-10" readOnly type="text" value="홍길동" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-secondary mb-2">연락처</label>
                    <input className="w-full border-surface-variant rounded-lg bg-surface-container-lowest text-sm p-2 focus:ring-1 focus:ring-primary-container focus:border-primary-container h-10" readOnly type="tel" value="010-1234-5678" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">이메일</label>
                  <input className="w-full border-surface-variant rounded-lg bg-surface-container-lowest text-sm p-2 focus:ring-1 focus:ring-primary-container focus:border-primary-container h-10" readOnly type="email" value="hong@sellersuite.kr" />
                </div>
              </div>
            </section>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-8 shadow-sm sticky top-8">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-surface-variant">주문 요약</h2>
              
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-on-surface">SellerSuite Pro 플랜 (연간)</p>
                    <p className="text-xs text-secondary mt-1">1 x ₩1,200,000</p>
                  </div>
                  <p className="text-sm font-medium text-on-surface">₩1,200,000</p>
                </div>
              </div>

              <div className="border-t border-surface-variant pt-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary">상품 금액</span>
                  <span className="text-sm text-on-surface">₩1,200,000</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary">할인</span>
                  <span className="text-sm text-error">- ₩120,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary">부가세 (10%)</span>
                  <span className="text-sm text-on-surface">₩108,000</span>
                </div>
              </div>

              <div className="border-t-2 border-on-surface pt-6 mb-8 flex justify-between items-end">
                <span className="text-base font-bold text-on-surface">총 결제 금액</span>
                <span className="text-3xl font-bold text-primary">₩1,188,000</span>
              </div>

              <div className="flex items-start gap-2 mb-8 bg-surface p-4 rounded-lg border border-surface-variant">
                <input className="mt-1 border-outline-variant text-primary rounded" id="terms" type="checkbox" />
                <label className="text-sm text-secondary cursor-pointer leading-tight" htmlFor="terms">
                  결제 조건 및 <a className="text-primary hover:underline" href="#">서비스 약관</a>, <a className="text-primary hover:underline" href="#">개인정보 처리방침</a>에 동의합니다. (필수)
                </label>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-primary text-on-primary h-12 rounded-lg text-base font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
              >
                {isProcessing ? "결제 준비 중..." : "결제하기"}
              </button>
              
              <p className="text-xs text-secondary text-center mt-4 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                안전하게 암호화되어 결제됩니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
