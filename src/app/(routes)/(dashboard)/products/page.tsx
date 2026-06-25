import { PageHeader } from "@/components/common/PageHeader";
import { ProductListClient } from "./_components/ProductListClient";
import { getSupplierProductsAction } from "@/app/actions/product.actions";
import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseBusinessRepository } from "@/infrastructure/repositories/SupabaseBusinessRepository";
import { GetBusinessesUseCase } from "@/core/application/use-cases/business/GetBusinessesUseCase";

interface ProductsPageProps {
  searchParams: Promise<{ businessId?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const businessId = resolvedParams.businessId || null;

  const result = await getSupplierProductsAction(undefined, businessId);
  const initialProducts = result.success && result.data ? result.data : [];

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

  return (
    <>
      <PageHeader 
        title="공급사 상품 목록" 
        description="도매처의 다양한 상품을 검색하고 소싱합니다." 
      />
      
      <ProductListClient 
        initialProducts={initialProducts} 
        mainBusinessName={selectedBusinessName}
        businessId={businessId}
      />
    </>
  );
}
