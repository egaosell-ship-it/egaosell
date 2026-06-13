import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseBrandRepository } from "@/infrastructure/repositories/SupabaseBrandRepository";
import { GetBrandsUseCase } from "@/core/application/use-cases/brand/GetBrandsUseCase";
import { Brand } from "@/core/domain/entities/Brand";
import AddBrandModal from "./AddBrandModal";

export default async function BrandListTab() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let brands: Brand[] = [];
  if (user) {
    const repository = new SupabaseBrandRepository();
    const useCase = new GetBrandsUseCase(repository);
    brands = await useCase.execute(user.id);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-on-surface">브랜드리스트</h2>
        <AddBrandModal />
      </div>

      <div className="overflow-x-auto border border-outline-variant rounded-md">
        <table className="w-full text-sm text-left text-on-surface">
          <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">번호</th>
              <th className="px-4 py-3 whitespace-nowrap">브랜드명</th>
              <th className="px-4 py-3 whitespace-nowrap">코드</th>
              <th className="px-4 py-3 whitespace-nowrap">카페24코드</th>
              <th className="px-4 py-3 whitespace-nowrap">등록날짜</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-on-surface-variant">
                  등록된 브랜드가 없습니다.
                </td>
              </tr>
            ) : (
              brands.map((brand, index) => (
                <tr key={brand.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{brand.brandName}</td>
                  <td className="px-4 py-3">{brand.code}</td>
                  <td className="px-4 py-3">{brand.cafe24Code}</td>
                  <td className="px-4 py-3">{brand.createdAt?.toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-primary hover:text-primary-fixed-variant text-xs font-medium mr-2 cursor-pointer">수정</button>
                    <button className="text-error hover:text-error/80 text-xs font-medium cursor-pointer">삭제</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
