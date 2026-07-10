'use client';

import { useState, useTransition } from 'react';
import { CollectedProductProps } from '@/core/domain/entities/CollectedProduct';
import { deleteCollectedProductAction, updateCollectedProductAction } from '@/app/actions/collected-product.actions';
import Image from 'next/image';

interface CollectedProductListClientProps {
  initialData: CollectedProductProps[];
}

export default function CollectedProductListClient({ initialData }: CollectedProductListClientProps) {
  const [products, setProducts] = useState<CollectedProductProps[]>(initialData);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // 수정 폼 상태
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 상품을 삭제하시겠습니까?')) return;

    startTransition(async () => {
      const result = await deleteCollectedProductAction(id);
      if (result.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert(`삭제 실패: ${result.error}`);
      }
    });
  };

  const handleEditStart = (product: CollectedProductProps) => {
    setEditingId(product.id);
    setEditName(product.productName);
    setEditPrice(product.price);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleEditSave = async (id: string) => {
    if (!editName.trim()) {
      alert('상품명을 입력해주세요.');
      return;
    }
    if (editPrice < 0) {
      alert('가격은 0원 이상이어야 합니다.');
      return;
    }

    startTransition(async () => {
      const result = await updateCollectedProductAction({
        id,
        productName: editName,
        price: editPrice
      });
      
      if (result.success) {
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, productName: editName, price: editPrice } : p
        ));
        setEditingId(null);
      } else {
        alert(`수정 실패: ${result.error}`);
      }
    });
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      {isPending && (
        <div className="absolute inset-0 bg-black/10 z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse text-body-sm font-body-sm text-on-surface">
          <thead className="bg-surface-container sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-4 font-medium border-b border-outline-variant w-16 text-center">번호</th>
              <th className="p-4 font-medium border-b border-outline-variant w-24">플랫폼</th>
              <th className="p-4 font-medium border-b border-outline-variant w-32">상품번호</th>
              <th className="p-4 font-medium border-b border-outline-variant w-20">이미지</th>
              <th className="p-4 font-medium border-b border-outline-variant flex-1 min-w-[200px]">상품명</th>
              <th className="p-4 font-medium border-b border-outline-variant w-32 text-right">가격</th>
              <th className="p-4 font-medium border-b border-outline-variant w-40 text-center">생성날짜</th>
              <th className="p-4 font-medium border-b border-outline-variant w-40 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-on-surface-variant">
                  수집된 상품이 없습니다. 익스텐션을 통해 상품을 수집해보세요!
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="p-4 text-center text-on-surface-variant">{index + 1}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-label-sm font-label-sm rounded-full">
                      {product.platform}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs">{product.productId}</td>
                  <td className="p-4">
                    {product.imageUrl ? (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden border border-outline-variant">
                        <img 
                          src={`/api/proxy-image?url=${encodeURIComponent(product.imageUrl)}`} 
                          alt="썸네일" 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iIzljOWM5YyIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-surface-variant rounded-md flex items-center justify-center text-[10px] text-on-surface-variant text-center">
                        No Img
                      </div>
                    )}
                  </td>
                  
                  {/* 상품명 & 가격 Editing 상태 처리 */}
                  {editingId === product.id ? (
                    <>
                      <td className="p-4">
                        <input 
                          type="text" 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <input 
                            type="number" 
                            value={editPrice} 
                            onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                            className="w-24 px-2 py-1 text-sm border border-primary rounded-md text-right focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface"
                          />
                          <span className="text-on-surface-variant">원</span>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4">
                        <div className="line-clamp-2" title={product.productName}>
                          {product.productName}
                        </div>
                      </td>
                      <td className="p-4 text-right tabular-nums whitespace-nowrap">
                        {product.price.toLocaleString()}원
                      </td>
                    </>
                  )}

                  <td className="p-4 text-center text-on-surface-variant text-xs tabular-nums">
                    {formatDate(product.createdAt)}
                  </td>
                  
                  <td className="p-4 text-center">
                    {editingId === product.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEditSave(product.id)}
                          className="px-3 py-1 bg-primary text-on-primary rounded-md text-label-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          저장
                        </button>
                        <button 
                          onClick={handleEditCancel}
                          className="px-3 py-1 bg-surface-variant text-on-surface-variant rounded-md text-label-sm font-medium hover:bg-outline-variant/30 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEditStart(product)}
                          className="px-3 py-1 border border-outline text-on-surface rounded-md text-label-sm font-medium hover:bg-surface-variant/50 transition-colors"
                        >
                          수정
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 border border-error text-error rounded-md text-label-sm font-medium hover:bg-error/10 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    )}
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
