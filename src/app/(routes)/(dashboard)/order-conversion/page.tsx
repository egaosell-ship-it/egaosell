import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { Button } from "@/components/common/Button";

interface PageProps {
  searchParams: Promise<{ businessId?: string; platform?: string }>;
}

export default async function OrderConversionPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { businessId, platform } = resolvedParams;

  const hasSelection = !!(businessId && platform);

  return (
    <div className="flex flex-col h-full gap-4">
      <PageHeader 
        title="주문 데이터 변환" 
        description="오픈마켓 발주서를 택배사 송장 양식으로 변환합니다." 
      />
      
      {!hasSelection ? (
        <div className="mt-2 flex flex-col gap-4">
          <Panel>
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">ads_click</span>
              <p className="text-sm font-medium">상단 메뉴 [주문 변환]에서 상호와 플랫폼을 선택해주세요.</p>
            </div>
          </Panel>
        </div>
      ) : (
        <div className="flex-1 flex flex-col mt-2 min-h-[400px]">
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
            <span className="text-sm font-bold text-on-surface">{platform}</span>
            <span className="text-xs text-on-surface-variant">플랫폼 주문 데이터 변환</span>
          </div>
          
          <div className="flex-1 flex flex-col border border-outline-variant rounded-md overflow-hidden bg-surface-container-lowest shadow-sm">
            <textarea 
              className="flex-1 w-full p-4 text-sm text-on-surface bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="여기에 주문 데이터를 붙여넣으세요..."
            />
            <div className="border-t border-outline-variant bg-surface-container-low p-3 flex justify-end shrink-0">
              <Button icon="transform">변환</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
