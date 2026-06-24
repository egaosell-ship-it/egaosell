import { MemoWidget } from "@/components/dashboard/MemoWidget";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { getMemosAction } from "@/app/actions/memo.actions";

export default async function DashboardPage() {
  const memosResult = await getMemosAction();
  const initialMemos = memosResult.success && memosResult.data ? memosResult.data : [];
  return (
    <>
      {/* Page Header */}
      <PageHeader title="개요" description="반가워요! 오늘 스토어에서 일어난 현황입니다.">
        <div className="flex gap-2">
          <Button variant="outline" icon="download">
            보고서 내보내기
          </Button>
          <Button variant="primary" icon="add">
            신규 상품 등록
          </Button>
        </div>
      </PageHeader>

      <div className="w-full mb-2">
        <MemoWidget initialMemos={initialMemos} />
      </div>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex flex-col gap-2 hover:bg-surface-container-low transition-colors duration-200 border-b-2 border-b-primary shadow-sm">
          <div className="flex justify-between items-start">
            <h2 className="text-xs text-secondary uppercase tracking-wider font-semibold">이번달 처리 주문수</h2>
            <span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-sm font-bold text-on-surface">1,248</span>
            <span className="text-xs text-[#059669] flex items-center font-medium">
              <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span> 12.5%
            </span>
          </div>
        </div>
        {/* KPI 2 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex flex-col gap-2 hover:bg-surface-container-low transition-colors duration-200 shadow-sm">
          <div className="flex justify-between items-start">
            <h2 className="text-xs text-secondary uppercase tracking-wider font-semibold">활성 상품수</h2>
            <span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-sm font-bold text-on-surface">8,502</span>
            <span className="text-xs text-[#059669] flex items-center font-medium">
              <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span> 3.1%
            </span>
          </div>
        </div>
        {/* KPI 3 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex flex-col gap-2 hover:bg-surface-container-low transition-colors duration-200 shadow-sm">
          <div className="flex justify-between items-start">
            <h2 className="text-xs text-secondary uppercase tracking-wider font-semibold">예상 마진</h2>
            <span className="material-symbols-outlined text-primary bg-primary/10 rounded-full p-1 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-sm font-bold text-on-surface">₩45.2M</span>
            <span className="text-xs text-[#DC2626] flex items-center font-medium">
              <span className="material-symbols-outlined text-[12px] mr-0.5">trending_down</span> 1.2%
            </span>
          </div>
        </div>
      </section>

      {/* Data Tables Area */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col shadow-sm">
          <div className="px-3 py-2 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
            <h3 className="text-sm font-semibold text-on-surface">주문 상태</h3>
            <button className="text-primary text-xs hover:underline">전체 보기</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-2 px-3 text-[11px] text-secondary uppercase tracking-wider font-semibold">주문 ID</th>
                  <th className="py-2 px-3 text-[11px] text-secondary uppercase tracking-wider font-semibold">고객명</th>
                  <th className="py-2 px-3 text-[11px] text-secondary uppercase tracking-wider font-semibold">배송 상태</th>
                  <th className="py-2 px-3 text-[11px] text-secondary uppercase tracking-wider font-semibold text-right">결제 금액</th>
                </tr>
              </thead>
              <tbody className="text-xs text-on-surface divide-y divide-outline-variant">
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-1.5 px-3 font-medium text-primary">#ORD-0921</td>
                  <td className="py-1.5 px-3">김*수</td>
                  <td className="py-1.5 px-3"><span className="bg-[#DEF7EC] text-[#03543F] px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">처리 중</span></td>
                  <td className="py-1.5 px-3 text-right font-medium">₩125,000</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-1.5 px-3 font-medium text-primary">#ORD-0920</td>
                  <td className="py-1.5 px-3">이*진</td>
                  <td className="py-1.5 px-3"><span className="bg-[#E1EFFE] text-[#1E429F] px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">배송 중</span></td>
                  <td className="py-1.5 px-3 text-right font-medium">₩89,000</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-1.5 px-3 font-medium text-primary">#ORD-0919</td>
                  <td className="py-1.5 px-3">박*훈</td>
                  <td className="py-1.5 px-3"><span className="bg-[#E1EFFE] text-[#1E429F] px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">배송 중</span></td>
                  <td className="py-1.5 px-3 text-right font-medium">₩210,000</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-1.5 px-3 font-medium text-primary">#ORD-0918</td>
                  <td className="py-1.5 px-3">최*영</td>
                  <td className="py-1.5 px-3"><span className="bg-[#FDE8E8] text-[#9B1C1C] px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">취소됨</span></td>
                  <td className="py-1.5 px-3 text-right font-medium">₩45,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Products Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col shadow-sm">
          <div className="px-3 py-2 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
            <h3 className="text-sm font-semibold text-on-surface">최근 등록 상품</h3>
            <button className="text-primary text-xs hover:underline">상품 관리</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-2 px-3 text-[11px] text-secondary uppercase tracking-wider font-semibold">상품명</th>
                  <th className="py-2 px-3 text-[11px] text-secondary uppercase tracking-wider font-semibold">카테고리</th>
                  <th className="py-2 px-3 text-[11px] text-secondary uppercase tracking-wider font-semibold text-right">재고</th>
                  <th className="py-2 px-3 text-[11px] text-secondary uppercase tracking-wider font-semibold text-right">판매가</th>
                </tr>
              </thead>
              <tbody className="text-xs text-on-surface divide-y divide-outline-variant">
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-1.5 px-3 font-medium">프리미엄 무선 이어폰 Pro Max</td>
                  <td className="py-1.5 px-3 text-secondary">가전/디지털</td>
                  <td className="py-1.5 px-3 text-right">142</td>
                  <td className="py-1.5 px-3 text-right">₩299,000</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-1.5 px-3 font-medium">오가닉 순면 베개 커버 세트</td>
                  <td className="py-1.5 px-3 text-secondary">생활/리빙</td>
                  <td className="py-1.5 px-3 text-right">85</td>
                  <td className="py-1.5 px-3 text-right">₩35,000</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-1.5 px-3 font-medium">스마트 홈 피트니스 미러</td>
                  <td className="py-1.5 px-3 text-secondary">스포츠/레저</td>
                  <td className="py-1.5 px-3 text-right text-error font-medium">12</td>
                  <td className="py-1.5 px-3 text-right">₩1,250,000</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-1.5 px-3 font-medium">전문가용 핸드드립 커피 세트</td>
                  <td className="py-1.5 px-3 text-secondary">주방용품</td>
                  <td className="py-1.5 px-3 text-right">300+</td>
                  <td className="py-1.5 px-3 text-right">₩89,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
