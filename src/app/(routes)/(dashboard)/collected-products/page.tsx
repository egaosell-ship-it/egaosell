import { getCollectedProductsAction } from '@/app/actions/collected-product.actions';
import CollectedProductListClient from './_components/CollectedProductListClient';

export default async function CollectedProductsPage() {
  const result = await getCollectedProductsAction();
  const initialData = result.success ? result.data || [] : [];

  return (
    <div className="flex flex-col w-full h-full p-6 overflow-hidden bg-surface">
      <div className="mb-6">
        <h1 className="text-display-sm font-display-sm font-bold text-on-surface">수집 상품 목록</h1>
        <p className="text-body-md font-body-md text-on-surface-variant mt-2">
          익스텐션을 통해 다양한 플랫폼에서 수집된 상품들을 관리할 수 있습니다.
        </p>
      </div>
      
      <div className="flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm">
        <CollectedProductListClient initialData={initialData} />
      </div>
    </div>
  );
}
