import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseNaverApiRepository } from "@/infrastructure/repositories/SupabaseNaverApiRepository";
import { SupabaseBusinessRepository } from "@/infrastructure/repositories/SupabaseBusinessRepository";
import { GetNaverApisUseCase } from "@/core/application/use-cases/naverApi/GetNaverApisUseCase";
import { GetBusinessesUseCase } from "@/core/application/use-cases/business/GetBusinessesUseCase";
import { NaverApi } from "@/core/domain/entities/NaverApi";
import { Business } from "@/core/domain/entities/Business";
import AddNaverApiModal from "./AddNaverApiModal";
import NaverApiActionButtons from "./NaverApiActionButtons";

export default async function NaverApiTab() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let apis: NaverApi[] = [];
  let businesses: Business[] = [];
  
  if (user) {
    const apiRepo = new SupabaseNaverApiRepository();
    const getApisUseCase = new GetNaverApisUseCase(apiRepo);
    apis = await getApisUseCase.execute(user.id);

    const businessRepo = new SupabaseBusinessRepository();
    const getBusinessesUseCase = new GetBusinessesUseCase(businessRepo);
    businesses = await getBusinessesUseCase.execute(user.id);
  }

  const plainBusinesses = businesses.map(b => b.toPlainObj());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-on-surface">네이버api</h2>
        <AddNaverApiModal businesses={plainBusinesses} />
      </div>

      <div className="overflow-x-auto border border-outline-variant rounded-md">
        <table className="w-full text-sm text-left text-on-surface">
          <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">번호</th>
              <th className="px-4 py-3 whitespace-nowrap">종류</th>
              <th className="px-4 py-3 whitespace-nowrap">사업자명</th>
              <th className="px-4 py-3 whitespace-nowrap">애플리케이션 ID</th>
              <th className="px-4 py-3 whitespace-nowrap">애플리케이션 시크릿</th>
              <th className="px-4 py-3 whitespace-nowrap">API호출 IP</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {apis.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant">
                  등록된 네이버 API 정보가 없습니다.
                </td>
              </tr>
            ) : (
              apis.map((api, index) => {
                const biz = businesses.find(b => b.id === api.businessId);
                const companyName = biz ? biz.companyName : "알 수 없음";

                return (
                  <tr key={api.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{api.type}</td>
                    <td className="px-4 py-3 font-medium">{companyName}</td>
                    <td className="px-4 py-3 font-mono text-xs">{api.appId}</td>
                    <td className="px-4 py-3 font-mono text-xs">••••••••</td>
                    <td className="px-4 py-3">{api.apiIp || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <NaverApiActionButtons api={api.toPlainObj()} />
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
