import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { OrderConversionClient } from "./_components/OrderConversionClient";
import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabasePlatformMarginRepository } from "@/infrastructure/repositories/SupabasePlatformMarginRepository";
import { GetPlatformMarginsUseCase } from "@/core/application/use-cases/platformMargin/GetPlatformMarginsUseCase";
import { PlatformMargin } from "@/core/domain/entities/PlatformMargin";
import { SupabaseBusinessRepository } from "@/infrastructure/repositories/SupabaseBusinessRepository";
import { GetBusinessesUseCase } from "@/core/application/use-cases/business/GetBusinessesUseCase";
import { SupabaseOwnedStoreRepository } from "@/infrastructure/repositories/SupabaseOwnedStoreRepository";
import { GetOwnedStoresUseCase } from "@/core/application/use-cases/ownedStore/GetOwnedStoresUseCase";
import { OwnedStore } from "@/core/domain/entities/OwnedStore";
import { SupabaseProductCodeSettingRepository } from "@/infrastructure/repositories/SupabaseProductCodeSettingRepository";
import { GetProductCodeSettingsUseCase } from "@/core/application/use-cases/productCodeSetting/GetProductCodeSettingsUseCase";
import { ProductCodeSetting } from "@/core/domain/entities/ProductCodeSetting";

interface PageProps {
  searchParams: Promise<{ businessId?: string; storeId?: string }>;
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default async function OrderConversionPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { businessId, storeId } = resolvedParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let margins: PlatformMargin[] = [];
  let ownedStores: OwnedStore[] = [];
  let productCodeSettings: ProductCodeSetting[] = [];
  let businessName = "";

  if (user) {
    if (!businessId) {
      const businessRepo = new SupabaseBusinessRepository();
      const getBusinessesUseCase = new GetBusinessesUseCase(businessRepo);
      const businesses = await getBusinessesUseCase.execute(user.id);
      const mainBiz = businesses.find(b => b.isMain);
      if (mainBiz) {
        redirect(`/order-conversion?businessId=${mainBiz.id}`);
      }
    } else {
      const marginRepo = new SupabasePlatformMarginRepository();
      const getMarginsUseCase = new GetPlatformMarginsUseCase(marginRepo);
      const allMargins = await getMarginsUseCase.execute(user.id);
      margins = allMargins.filter(m => m.businessId === businessId);

      const storeRepo = new SupabaseOwnedStoreRepository();
      const getStoresUseCase = new GetOwnedStoresUseCase(storeRepo);
      const allStores = await getStoresUseCase.execute(user.id);
      ownedStores = allStores.filter(s => s.businessId === businessId).reverse(); // 역순

      const productCodeSettingRepo = new SupabaseProductCodeSettingRepository();
      const getProductCodeSettingsUseCase = new GetProductCodeSettingsUseCase(productCodeSettingRepo);
      productCodeSettings = await getProductCodeSettingsUseCase.execute(user.id);

      const businessRepo = new SupabaseBusinessRepository();
      const getBusinessesUseCase = new GetBusinessesUseCase(businessRepo);
      const businesses = await getBusinessesUseCase.execute(user.id);
      const biz = businesses.find(b => b.id === businessId);
      if (biz) {
        businessName = biz.companyName;
      }
    }
  }

  const hasBusinessId = !!businessId;
  const currentStoreId = storeId || (ownedStores.length > 0 ? ownedStores[0].id : "");
  const currentStore = ownedStores.find(s => s.id === currentStoreId);
  const currentPlatformName = currentStore?.platformName || "";
  const currentMargin = margins.find(m => m.platformName === currentPlatformName);
  const currentColor = currentMargin?.colorCode || "#E2E8F0";
  const currentProductCodeSetting = productCodeSettings.find(s => s.platformName === currentPlatformName);

  return (
    <div className="flex flex-col h-full gap-4">
      <PageHeader 
        title={businessName ? `${businessName} 주문 데이터 변환` : "주문 데이터 변환"} 
        description="오픈마켓 발주서를 택배사 송장 양식으로 변환합니다." 
      />

      {/* 서브메뉴(플랫폼 탭) 렌더링 */}
      {hasBusinessId && (
        <div className="flex border-b border-outline-variant mt-2 px-1 gap-2 overflow-x-auto">
          {ownedStores.length === 0 ? (
            <div className="py-2 text-sm text-on-surface-variant">등록된 스토어가 없습니다. 설정 메뉴에서 보유스토어를 추가해주세요.</div>
          ) : (
            ownedStores.map(store => {
              const isActive = currentStoreId === store.id;
              const margin = margins.find(m => m.platformName === store.platformName);
              const colorCode = margin?.colorCode || "#E2E8F0";

              return (
                <Link
                  key={store.id}
                  href={`/order-conversion?businessId=${businessId}&storeId=${store.id}`}
                  style={{ 
                    color: isActive ? colorCode : undefined,
                    borderBottomColor: isActive ? colorCode : 'transparent'
                  }}
                  className={`px-4 py-2 text-sm border-b-2 transition-colors duration-200 whitespace-nowrap font-bold ${
                    !isActive && 'text-on-surface-variant hover:text-on-surface hover:border-outline'
                  }`}
                >
                  {store.platformName}({store.siteName})
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
      ) : (
        <OrderConversionClient 
          key={currentStoreId}
          currentStore={currentStore ? currentStore.toPlainObj() : null} 
          currentColor={currentColor} 
          currentSetting={currentProductCodeSetting ? currentProductCodeSetting.toPlainObj() : null}
        />
      )}
    </div>
  );
}
