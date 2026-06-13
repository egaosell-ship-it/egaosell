import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseCoupangApiRepository } from "@/infrastructure/repositories/SupabaseCoupangApiRepository";
import { SupabaseBusinessRepository } from "@/infrastructure/repositories/SupabaseBusinessRepository";
import { GetCoupangApisUseCase } from "@/core/application/use-cases/coupangApi/GetCoupangApisUseCase";
import { GetBusinessesUseCase } from "@/core/application/use-cases/business/GetBusinessesUseCase";
import { CoupangApi } from "@/core/domain/entities/CoupangApi";
import { Business } from "@/core/domain/entities/Business";
import AddCoupangApiModal from "./AddCoupangApiModal";
import CoupangApiActionButtons from "./CoupangApiActionButtons";

export default async function CoupangApiTab() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let apis: CoupangApi[] = [];
  let businesses: Business[] = [];
  
  if (user) {
    const apiRepo = new SupabaseCoupangApiRepository();
    const getApisUseCase = new GetCoupangApisUseCase(apiRepo);
    apis = await getApisUseCase.execute(user.id);

    const businessRepo = new SupabaseBusinessRepository();
    const getBusinessesUseCase = new GetBusinessesUseCase(businessRepo);
    businesses = await getBusinessesUseCase.execute(user.id);
  }

  const plainBusinesses = businesses.map(b => b.toPlainObj());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-on-surface">쿠팡API</h2>
        <AddCoupangApiModal businesses={plainBusinesses} />
      </div>

      <div className="overflow-x-auto border border-outline-variant rounded-md">
        <table className="w-full text-sm text-left text-on-surface">
          <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">번호</th>
              <th className="px-4 py-3 whitespace-nowrap">사용목적</th>
              <th className="px-4 py-3 whitespace-nowrap">사업자명</th>
              <th className="px-4 py-3 whitespace-nowrap">업체코드</th>
              <th className="px-4 py-3 whitespace-nowrap">유효기간</th>
              <th className="px-4 py-3 whitespace-nowrap">Access Key</th>
              <th className="px-4 py-3 whitespace-nowrap">Secret Key</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {apis.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-on-surface-variant">
                  등록된 쿠팡 API 정보가 없습니다.
                </td>
              </tr>
            ) : (
              apis.map((api, index) => {
                const biz = businesses.find(b => b.id === api.businessId);
                const companyName = biz ? biz.companyName : "알 수 없음";

                return (
                  <tr key={api.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{api.purpose}</td>
                    <td className="px-4 py-3 font-medium">{companyName}</td>
                    <td className="px-4 py-3">{api.vendorCode}</td>
                    <td className="px-4 py-3">
                      {api.expireDate ? api.expireDate.toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{api.accessKey}</td>
                    <td className="px-4 py-3 font-mono text-xs">••••••••</td>
                    <td className="px-4 py-3 text-center">
                      <CoupangApiActionButtons api={api.toPlainObj()} businesses={plainBusinesses} />
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
