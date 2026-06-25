import { PageHeader } from "@/components/common/PageHeader";
import { ProductListClient } from "./_components/ProductListClient";
import { getSupplierProductsAction } from "@/app/actions/product.actions";
import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseBusinessRepository } from "@/infrastructure/repositories/SupabaseBusinessRepository";
import { GetBusinessesUseCase } from "@/core/application/use-cases/business/GetBusinessesUseCase";

export default async function ProductsPage() {
  const result = await getSupplierProductsAction();
  const initialProducts = result.success && result.data ? result.data : [];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let mainBusinessName = "";
  if (user) {
    const repository = new SupabaseBusinessRepository();
    const useCase = new GetBusinessesUseCase(repository);
    const businesses = await useCase.execute(user.id);
    const mainBusiness = businesses.find((b: any) => b.isMain);
    if (mainBusiness) {
      mainBusinessName = mainBusiness.companyName;
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
        mainBusinessName={mainBusinessName}
      />
    </>
  );
}
