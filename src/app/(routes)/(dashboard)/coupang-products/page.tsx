import { PageHeader } from "@/components/common/PageHeader";
import { CoupangProductListClient } from "./_components/CoupangProductListClient";
import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseBusinessRepository } from "@/infrastructure/repositories/SupabaseBusinessRepository";
import { GetBusinessesUseCase } from "@/core/application/use-cases/business/GetBusinessesUseCase";

interface CoupangProductsPageProps {
  searchParams: Promise<{ businessId?: string }>;
}

export default async function CoupangProductsPage({ searchParams }: CoupangProductsPageProps) {
  const resolvedParams = await searchParams;
  const businessId = resolvedParams.businessId || null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let selectedBusinessName = "";
  if (user) {
    const repository = new SupabaseBusinessRepository();
    const useCase = new GetBusinessesUseCase(repository);
    const businesses = await useCase.execute(user.id);
    
    if (businessId) {
      const selected = businesses.find((b: any) => b.id === businessId);
      if (selected) selectedBusinessName = selected.companyName;
    } else {
      const mainBusiness = businesses.find((b: any) => b.isMain);
      if (mainBusiness) {
        selectedBusinessName = mainBusiness.companyName;
      }
    }
  }

  // 아직 쿠팡용 백엔드 API가 없으므로 빈 데이터로 시작
  const initialProducts: any[] = [];

  return (
    <>
      <PageHeader 
        title="쿠팡상품목록" 
        description="쿠팡 채널의 다양한 상품을 관리합니다." 
      />
      
      <CoupangProductListClient 
        initialProducts={initialProducts} 
        mainBusinessName={selectedBusinessName}
        businessId={businessId}
      />
    </>
  );
}
