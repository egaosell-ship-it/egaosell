import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { ProductListClient } from "./_components/ProductListClient";

export default function ProductsPage() {
  return (
    <>
      <PageHeader 
        title="공급사 상품 목록" 
        description="도매처의 다양한 상품을 검색하고 소싱합니다." 
      />
      
      <ProductListClient />
    </>
  );
}
