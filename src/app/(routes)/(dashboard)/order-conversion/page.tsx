import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { Button } from "@/components/common/Button";
import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabasePlatformMarginRepository } from "@/infrastructure/repositories/SupabasePlatformMarginRepository";
import { GetPlatformMarginsUseCase } from "@/core/application/use-cases/platformMargin/GetPlatformMarginsUseCase";
import { PlatformMargin } from "@/core/domain/entities/PlatformMargin";

interface PageProps {
  searchParams: Promise<{ businessId?: string; platform?: string }>;
}

export default async function OrderConversionPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { businessId, platform } = resolvedParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let margins: PlatformMargin[] = [];
  if (user && businessId) {
    const marginRepo = new SupabasePlatformMarginRepository();
    const getMarginsUseCase = new GetPlatformMarginsUseCase(marginRepo);
    const allMargins = await getMarginsUseCase.execute(user.id);
    margins = allMargins.filter(m => m.businessId === businessId);
  }

  const hasBusinessId = !!businessId;
  const hasPlatform = !!platform;

  return (
    <div className="flex flex-col h-full gap-4">
      <PageHeader 
        title="주문 데이터 변환" 
        description="오픈마켓 발주서를 택배사 송장 양식으로 변환합니다." 
      />

      {/* 서브메뉴(플랫폼 탭) 렌더링 */}
      {hasBusinessId && (
        <div className="flex border-b border-outline-variant mt-2 px-1 gap-2 overflow-x-auto">
          {margins.length === 0 ? (
            <div className="py-2 text-sm text-on-surface-variant">등록된 플랫폼 마진 설정이 없습니다. 설정 메뉴에서 먼저 플랫폼을 추가해주세요.</div>
          ) : (
            margins.map(margin => {
              const isActive = platform === margin.platformName;
              return (
                <Link
                  key={margin.id}
                  href={`/order-conversion?businessId=${businessId}&platform=${encodeURIComponent(margin.platformName)}`}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
                    isActive
                      ? 'border-primary text-primary-fixed-variant'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline'
                  }`}
                >
                  {margin.platformName}
                </Link>
              );
            })
          )}
        </div>
      )}
      
      {!hasBusinessId ? (
        <div className="mt-2 flex flex-col gap-4">
          <Panel>
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">storefront</span>
              <p className="text-sm font-medium">상단 메뉴 [주문 변환]에서 상호(사업자)를 선택해주세요.</p>
            </div>
          </Panel>
        </div>
      ) : !hasPlatform ? (
        <div className="mt-2 flex flex-col gap-4">
          <Panel>
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">ads_click</span>
              <p className="text-sm font-medium">위 탭에서 변환할 플랫폼을 선택해주세요.</p>
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
