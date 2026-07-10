import { getCollectedProductByIdAction } from '@/app/actions/collected-product.actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const result = await getCollectedProductByIdAction(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="flex items-center justify-between p-6 border-b border-outline-variant bg-surface-container-lowest">
        <div>
          <h1 className="text-title-lg font-title-lg text-on-surface mb-2">{product.productName}</h1>
          <div className="flex items-center gap-4 text-body-sm text-on-surface-variant">
            <span className="px-2 py-1 bg-primary/10 text-primary text-label-sm font-label-sm rounded-full">
              {product.platform}
            </span>
            <span className="font-mono">{product.productId}</span>
            <span className="font-medium text-on-surface">{product.price.toLocaleString()}원</span>
          </div>
        </div>
        <Link 
          href="/collected-products"
          className="px-4 py-2 border border-outline text-on-surface rounded-md text-label-md font-medium hover:bg-surface-variant/50 transition-colors"
        >
          목록으로 돌아가기
        </Link>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* 상품 설명 */}
          {product.description && (
            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <h2 className="text-title-md font-title-md text-on-surface mb-4">상품 설명</h2>
              <div className="text-body-md text-on-surface whitespace-pre-wrap leading-relaxed">
                {product.description}
              </div>
            </section>
          )}

          {/* 상세 이미지 목록 */}
          {product.detailImages && product.detailImages.length > 0 && (
            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <h2 className="text-title-md font-title-md text-on-surface mb-4">상세 이미지 ({product.detailImages.length}장)</h2>
              <div className="flex flex-col gap-4 items-center">
                {product.detailImages.map((imgUrl: string, index: number) => (
                  <div key={index} className="w-full max-w-2xl border border-outline-variant rounded-lg overflow-hidden shadow-sm">
                    {/* 외부 도메인 이미지이므로 넥스트 이미지가 아닌 일반 img 태그나 proxy를 활용할 수 있음.
                        여기서는 원본 렌더링에 가까운 형태를 위해 직접 img 태그 사용 */}
                    <img 
                      src={`/api/proxy-image?url=${encodeURIComponent(imgUrl)}`} 
                      alt={`상세 이미지 ${index + 1}`} 
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {!product.description && (!product.detailImages || product.detailImages.length === 0) && (
            <div className="text-center py-20 text-on-surface-variant">
              수집된 상세 설명이나 이미지가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
