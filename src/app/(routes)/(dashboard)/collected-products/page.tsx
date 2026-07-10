import { getCollectedProductsAction } from '@/app/actions/collected-product.actions';
import { checkSubscriptionAction } from '@/app/actions/subscription.actions';
import CollectedProductListClient from './_components/CollectedProductListClient';
import Link from 'next/link';

export default async function CollectedProductsPage() {
  const isPremium = await checkSubscriptionAction();
  
  if (!isPremium) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-6 bg-surface">
        <span className="text-[64px] mb-4">🔒</span>
        <h1 className="text-title-lg font-bold text-on-surface mb-2">유료 기능 안내</h1>
        <p className="text-body-md text-on-surface-variant mb-6 text-center">
          수집 상품 관리 기능은 프로 플랜 이상의 <br />
          유료 구독 회원만 이용 가능합니다.
        </p>
        <Link href="/pricing" className="px-6 py-2 bg-primary text-on-primary rounded-md font-medium hover:bg-primary/90 transition-colors">
          구독 업그레이드 하기
        </Link>
      </div>
    );
  }

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
