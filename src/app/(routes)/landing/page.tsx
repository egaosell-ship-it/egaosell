import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="max-w-[1440px] mx-auto">
      {/* Hero Section */}
      <section className="px-md py-[120px] flex flex-col md:flex-row items-center gap-xl">
        <div className="flex-1 flex flex-col gap-md items-start">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary-container text-primary-container text-label-sm font-label-sm uppercase tracking-wide border border-outline-variant/30">
            SaaS for K-Sellers
          </span>
          <h1 className="text-display-lg font-display-lg text-on-surface leading-tight">
            온라인 셀러를 위한<br />모든 것, 한 곳에서
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-lg mt-sm">
            복잡한 주문 관리, 공급가 비교, 상품 크롤링까지 한 번에 자동화하세요. EgaoSell과 함께라면 매출 성장에만 집중할 수 있습니다.
          </p>
          <div className="flex gap-sm mt-lg">
            <Link href="/login" className="bg-primary-container text-on-primary text-label-md font-label-md px-6 py-3 rounded active:scale-95 transition-transform duration-150 shadow-sm hover:bg-primary-fixed-variant">
              무료 체험 시작하기
            </Link>
            <button className="bg-surface-container-lowest text-on-surface border border-outline-variant text-label-md font-label-md px-6 py-3 rounded active:scale-95 transition-transform duration-150 hover:bg-surface-container-low">
              데모 영상 보기
            </button>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div 
            className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-outline-variant bg-surface-container-lowest bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoLZQAYUPZnKPKMaE1LhDJX9AMrV3En5iXx56Gg7TUr_7Y0u78qBXU9mbga5bjYZp9U0grr5h3ObIxBzEsPFNJIescBzEqFUwtz2UomHD_iue2Ju3zVzXnx-NfYjBfkw1Kik-Zk1RHdqPP7UrmfhzeYxGNc6JsdRoajkeB2oFj-WiCWFnfvtDz01YVLv4IQGjd4hw5-PmfF_Ld-hk3JLSPbbF44kldVEKO84a3RV0F0jKPQUt6t5puwTU3bKCM5BDzNCnwKge2aS8')" }}
          >
          </div>
          {/* Abstract floating element */}
          <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-sm rounded-lg border border-outline-variant shadow-sm flex items-center gap-sm">
            <div className="w-10 h-10 rounded bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                trending_up
              </span>
            </div>
            <div>
              <div className="text-label-sm font-label-sm text-on-surface-variant uppercase">월간 마진율</div>
              <div className="text-headline-sm font-headline-sm text-on-surface font-bold">+24.8%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight Section (Bento Grid) */}
      <section className="px-md py-[96px] bg-surface-container-low border-y border-outline-variant" id="features">
        <div className="text-center mb-xl">
          <h2 className="text-headline-lg font-headline-lg text-on-surface mb-sm">업무 시간을 70% 단축하는 핵심 기능</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">단순 반복 업무는 시스템에 맡기고, 핵심 비즈니스에 집중하세요.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-primary-container/50 transition-colors duration-300 flex flex-col gap-sm shadow-sm group">
            <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center group-hover:bg-secondary-container transition-colors duration-300">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-container transition-colors duration-300">receipt_long</span>
            </div>
            <h3 className="text-headline-sm font-headline-sm text-on-surface mt-sm">주문서 일괄 → 택배 양식 변환</h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant">여러 마켓의 주문 데이터를 한 번에 수집하여 지정된 택배사 양식으로 자동 변환합니다. 오배송 위험을 원천 차단하세요.</p>
          </div>
          {/* Feature 2 */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-primary-container/50 transition-colors duration-300 flex flex-col gap-sm shadow-sm group">
            <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center group-hover:bg-secondary-container transition-colors duration-300">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-container transition-colors duration-300">inventory_2</span>
            </div>
            <h3 className="text-headline-sm font-headline-sm text-on-surface mt-sm">업체별 상품 리스트 제공</h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant">수백 개의 도매처 상품 데이터를 카테고리별, 마진율별로 한눈에 비교하고 관리할 수 있는 통합 대시보드를 제공합니다.</p>
          </div>
          {/* Feature 3 */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-primary-container/50 transition-colors duration-300 flex flex-col gap-sm shadow-sm group">
            <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center group-hover:bg-secondary-container transition-colors duration-300">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-container transition-colors duration-300">api</span>
            </div>
            <h3 className="text-headline-sm font-headline-sm text-on-surface mt-sm">API 연동 상품 크롤링</h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant">공식 API 및 자체 엔진을 통해 타겟 사이트의 상품 정보(이미지, 가격, 옵션)를 빠르고 정확하게 수집하여 등록합니다.</p>
          </div>
          {/* Feature 4 */}
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant hover:border-primary-container/50 transition-colors duration-300 flex flex-col gap-sm shadow-sm group">
            <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center group-hover:bg-secondary-container transition-colors duration-300">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-container transition-colors duration-300">calculate</span>
            </div>
            <h3 className="text-headline-sm font-headline-sm text-on-surface mt-sm">공급가/마진 자동 계산</h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant">수수료, 배송비, 포장비 등 모든 변수를 반영한 실질 마진율을 실시간으로 계산하여 최적의 판매가를 제안합니다.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
