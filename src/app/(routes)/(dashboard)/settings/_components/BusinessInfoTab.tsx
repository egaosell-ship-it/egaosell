import { createClient } from '@/infrastructure/config/supabase/server';
import { SupabaseBusinessRepository } from '@/infrastructure/repositories/SupabaseBusinessRepository';
import { GetBusinessesUseCase } from '@/core/application/use-cases/business/GetBusinessesUseCase';
import { Business } from '@/core/domain/entities/Business';
import AddBusinessModal from './AddBusinessModal';

export default async function BusinessInfoTab() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let businesses: Business[] = [];
  if (user) {
    const repository = new SupabaseBusinessRepository();
    const useCase = new GetBusinessesUseCase(repository);
    businesses = await useCase.execute(user.id);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-on-surface">사업자정보관리</h2>
        <AddBusinessModal />
      </div>

      <div className="overflow-x-auto border border-outline-variant rounded-md">
        <table className="w-full text-sm text-left text-on-surface">
          <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">번호</th>
              <th className="px-4 py-3 whitespace-nowrap">사업자ID</th>
              <th className="px-4 py-3 whitespace-nowrap">상호</th>
              <th className="px-4 py-3 whitespace-nowrap">대표자명</th>
              <th className="px-4 py-3 whitespace-nowrap">사업장주소</th>
              <th className="px-4 py-3 whitespace-nowrap">대표전화</th>
              <th className="px-4 py-3 whitespace-nowrap">사업자등록번호</th>
              <th className="px-4 py-3 whitespace-nowrap">통신판매업신고번호</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {businesses.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-on-surface-variant">
                  등록된 사업자 정보가 없습니다.
                </td>
              </tr>
            ) : (
              businesses.map((biz, index) => (
                <tr key={biz.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{biz.businessId}</td>
                  <td className="px-4 py-3 font-medium">{biz.companyName}</td>
                  <td className="px-4 py-3">{biz.ceoName}</td>
                  <td className="px-4 py-3 truncate max-w-[200px]" title={biz.address || undefined}>{biz.address}</td>
                  <td className="px-4 py-3">{biz.phone}</td>
                  <td className="px-4 py-3">{biz.regNumber}</td>
                  <td className="px-4 py-3">{biz.mailOrderNumber}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-primary hover:text-primary-fixed-variant text-xs font-medium mr-2">수정</button>
                    <button className="text-error hover:text-error/80 text-xs font-medium">삭제</button>
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
