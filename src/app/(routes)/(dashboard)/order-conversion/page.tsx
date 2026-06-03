import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";

export default function OrderConversionPage() {
  return (
    <>
      <PageHeader 
        title="주문 데이터 변환" 
        description="오픈마켓 발주서를 택배사 송장 양식으로 변환합니다." 
      />
      
      <div className="mt-6 flex flex-col gap-4">
        <Panel>
          <p className="text-sm text-on-surface">준비 중인 페이지입니다.</p>
        </Panel>
      </div>
    </>
  );
}
