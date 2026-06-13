import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabasePlatformMarginRepository } from "@/infrastructure/repositories/SupabasePlatformMarginRepository";
import { SupabaseBusinessRepository } from "@/infrastructure/repositories/SupabaseBusinessRepository";
import { GetPlatformMarginsUseCase } from "@/core/application/use-cases/platformMargin/GetPlatformMarginsUseCase";
import { GetBusinessesUseCase } from "@/core/application/use-cases/business/GetBusinessesUseCase";
import { PlatformMargin } from "@/core/domain/entities/PlatformMargin";
import { Business } from "@/core/domain/entities/Business";
import AddPlatformMarginModal from "./AddPlatformMarginModal";

export default async function PlatformMarginTab() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let margins: PlatformMargin[] = [];
  let businesses: Business[] = [];
  
  if (user) {
    const marginRepo = new SupabasePlatformMarginRepository();
    const getMarginsUseCase = new GetPlatformMarginsUseCase(marginRepo);
    margins = await getMarginsUseCase.execute(user.id);

    const businessRepo = new SupabaseBusinessRepository();
    const getBusinessesUseCase = new GetBusinessesUseCase(businessRepo);
    businesses = await getBusinessesUseCase.execute(user.id);
  }

  const plainBusinesses = businesses.map(b => b.toPlainObj());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-on-surface">플랫폼마진세팅</h2>
        <AddPlatformMarginModal businesses={plainBusinesses} />
      </div>

      <div className="overflow-x-auto border border-outline-variant rounded-md">
        <table className="w-full text-sm text-left text-on-surface">
          <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">번호</th>
              <th className="px-4 py-3 whitespace-nowrap">상호</th>
              <th className="px-4 py-3 whitespace-nowrap">플랫폼</th>
              <th className="px-4 py-3 whitespace-nowrap">수수료</th>
              <th className="px-4 py-3 whitespace-nowrap">배송비</th>
              <th className="px-4 py-3 whitespace-nowrap">기타비용</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {margins.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant">
                  등록된 플랫폼 마진 세팅이 없습니다.
                </td>
              </tr>
            ) : (
              margins.map((plat, index) => {
                // 상호명 매칭
                const biz = businesses.find(b => b.id === plat.businessId);
                const companyName = biz ? biz.companyName : "알 수 없음";

                return (
                  <tr key={plat.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{companyName}</td>
                    <td className="px-4 py-3">{plat.platformName}</td>
                    <td className="px-4 py-3">{plat.commissionRate}%</td>
                    <td className="px-4 py-3">{plat.shippingFee.toLocaleString()}원</td>
                    <td className="px-4 py-3">{plat.otherCosts.toLocaleString()}원</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-primary hover:text-primary-fixed-variant text-xs font-medium mr-2 cursor-pointer">수정</button>
                      <button className="text-error hover:text-error/80 text-xs font-medium cursor-pointer">삭제</button>
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
