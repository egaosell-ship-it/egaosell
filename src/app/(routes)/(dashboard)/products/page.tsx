import { PageHeader } from "@/components/common/PageHeader";
import { ProductListClient } from "./_components/ProductListClient";
import { getSupplierProductsAction } from "@/app/actions/product.actions";

export default async function ProductsPage() {
  const result = await getSupplierProductsAction();
  const initialProducts = result.success && result.data ? result.data : [];

  return (
    <>
      <PageHeader 
        title="공급사 상품 목록" 
        description="도매처의 다양한 상품을 검색하고 소싱합니다." 
      />
      
      <ProductListClient initialProducts={initialProducts} />
    </>
  );
}
