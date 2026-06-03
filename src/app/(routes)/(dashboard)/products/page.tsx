import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";

export default function ProductsPage() {
  return (
    <>
      <PageHeader 
        title="공급사 상품 목록" 
        description="도매처의 다양한 상품을 검색하고 소싱합니다." 
      />
      
      <div className="mt-6 flex flex-col gap-4">
        <Panel>
          <p className="text-sm text-on-surface">준비 중인 페이지입니다.</p>
        </Panel>
      </div>
    </>
  );
}
