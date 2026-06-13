import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseOwnedStoreRepository } from "@/infrastructure/repositories/SupabaseOwnedStoreRepository";
import { SupabaseBusinessRepository } from "@/infrastructure/repositories/SupabaseBusinessRepository";
import { SupabasePlatformMarginRepository } from "@/infrastructure/repositories/SupabasePlatformMarginRepository";
import { GetOwnedStoresUseCase } from "@/core/application/use-cases/ownedStore/GetOwnedStoresUseCase";
import { GetBusinessesUseCase } from "@/core/application/use-cases/business/GetBusinessesUseCase";
import { GetPlatformMarginsUseCase } from "@/core/application/use-cases/platformMargin/GetPlatformMarginsUseCase";
import { OwnedStore } from "@/core/domain/entities/OwnedStore";
import { Business } from "@/core/domain/entities/Business";
import { PlatformMargin } from "@/core/domain/entities/PlatformMargin";
import AddOwnedStoreModal from "./AddOwnedStoreModal";
import EditOwnedStoreModal from "./EditOwnedStoreModal";
import OwnedStoreDeleteButton from "./OwnedStoreDeleteButton";

export default async function OwnedStoresTab() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let stores: OwnedStore[] = [];
  let businesses: Business[] = [];
  let margins: PlatformMargin[] = [];
  
  if (user) {
    const storeRepo = new SupabaseOwnedStoreRepository();
    const getStoresUseCase = new GetOwnedStoresUseCase(storeRepo);
    stores = await getStoresUseCase.execute(user.id);

    const businessRepo = new SupabaseBusinessRepository();
    const getBusinessesUseCase = new GetBusinessesUseCase(businessRepo);
    businesses = await getBusinessesUseCase.execute(user.id);

    const marginRepo = new SupabasePlatformMarginRepository();
    const getMarginsUseCase = new GetPlatformMarginsUseCase(marginRepo);
    margins = await getMarginsUseCase.execute(user.id);
  }

  const plainBusinesses = businesses.map(b => b.toPlainObj());
  const plainMargins = margins.map(m => m.toPlainObj());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-on-surface">보유스토어</h2>
        <AddOwnedStoreModal businesses={plainBusinesses} margins={plainMargins} />
      </div>

      <div className="overflow-x-auto border border-outline-variant rounded-md">
        <table className="w-full text-sm text-left text-on-surface">
          <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">번호</th>
              <th className="px-4 py-3 whitespace-nowrap">사업자명</th>
              <th className="px-4 py-3 whitespace-nowrap">플랫폼</th>
              <th className="px-4 py-3 whitespace-nowrap">로그인아이디</th>
              <th className="px-4 py-3 whitespace-nowrap">사이트명</th>
              <th className="px-4 py-3 whitespace-nowrap">스토어URL</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant">
                  등록된 보유스토어가 없습니다.
                </td>
              </tr>
            ) : (
              stores.map((store, index) => {
                const biz = businesses.find(b => b.id === store.businessId);
                const companyName = biz ? biz.companyName : "알 수 없음";

                return (
                  <tr key={store.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{companyName}</td>
                    <td className="px-4 py-3">{store.platformName}</td>
                    <td className="px-4 py-3">{store.loginId}</td>
                    <td className="px-4 py-3">{store.siteName}</td>
                    <td className="px-4 py-3 text-primary hover:underline max-w-[200px] truncate">
                      <a href={store.storeUrl} target="_blank" rel="noopener noreferrer">
                        {store.storeUrl}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <EditOwnedStoreModal businesses={plainBusinesses} margins={plainMargins} store={store.toPlainObj()} />
                      <OwnedStoreDeleteButton id={store.id as string} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
