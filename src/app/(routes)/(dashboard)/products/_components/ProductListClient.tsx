"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/common/Button";
import { Panel } from "@/components/common/Panel";
import { SupplierProductProps } from "@/core/domain/entities/SupplierProduct";
import { uploadSupplierProductsAction, deleteSupplierProductAction } from "@/app/actions/product.actions";
import { useRouter } from "next/navigation";

interface ProductListClientProps {
  initialProducts: SupplierProductProps[];
}

export function ProductListClient({ initialProducts }: ProductListClientProps) {
  const [perPage, setPerPage] = useState("100");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // "100개 보기" 등을 프론트엔드에서 간단히 페이징 처리하는 용도
  const displayedProducts = initialProducts.slice(0, parseInt(perPage, 10));

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // 헤더 옵션을 1로 주어 2차원 배열 형태로 데이터를 가져옴
          const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // 첫 행(헤더) 제외
          const rows = jsonData.slice(1);
          
          const newProducts: SupplierProductProps[] = [];

          for (const row of rows) {
            // 빈 행 무시
            if (!row || row.length === 0 || !row[1]) continue;

            const naver_product_id = row[0] ? String(row[0]) : null;
            const originalProductName = row[1] ? String(row[1]) : "";
            const registered_platform = row[2] ? String(row[2]) : null;
            const sell_price = row[3] ? parseInt(String(row[3]).replace(/,/g, ''), 10) : 0;
            const sub_category = row[4] ? String(row[4]) : null;
            const brand_name = row[5] ? String(row[5]) : null;
            const image_url = row[6] ? String(row[6]) : null;
            // row[7]은 상품등록일이나 보통 DB created_at을 사용하므로 제외하거나 보조로 사용
            
            // "공급가-공급사명[공급상품명]" 형식 파싱 (예: "5800-엘유티[아린]")
            let supply_price = 0;
            let supplier_name = "";
            let supply_product_name = originalProductName;

            const regex = /^(\d+)-(.*?)\[(.*?)\]$/;
            const match = originalProductName.match(regex);

            if (match) {
              supply_price = parseInt(match[1], 10);
              supplier_name = match[2];
              supply_product_name = match[3];
            }

            newProducts.push({
              naver_product_id,
              supply_product_name,
              supplier_name,
              brand_name,
              image_url,
              sell_price,
              supply_price,
              sub_category,
              registered_platform,
              // net_profit 은 백엔드(Entity)에서 자동 계산됨
              is_used: true
            });
          }

          if (newProducts.length === 0) {
            alert("저장할 데이터가 없습니다.");
            setIsUploading(false);
            return;
          }

          // 서버 액션 호출 (DB 인서트)
          const result = await uploadSupplierProductsAction(newProducts);
          
          if (result.success) {
            alert(`${newProducts.length}건의 상품이 성공적으로 등록되었습니다.`);
            router.refresh();
          } else {
            alert(`오류가 발생했습니다: ${result.error}`);
          }
        } catch (err) {
          console.error(err);
          alert("엑셀 파일 파싱 중 오류가 발생했습니다. 파일 형식을 확인해주세요.");
        } finally {
          setIsUploading(false);
          // 파일 input 초기화
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      };
      reader.readAsBinaryString(file);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    const result = await deleteSupplierProductAction(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(`삭제 오류: ${result.error}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <Panel>
        {/* 상단 컨트롤 영역 */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold text-on-surface">
            총 <span className="text-primary font-bold">{initialProducts.length.toLocaleString()}</span>개의 상품
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button 
              variant="outline" 
              icon="upload" 
              onClick={handleFileUploadClick}
              disabled={isUploading}
            >
              {isUploading ? "업로드 중..." : "엑셀업로드"}
            </Button>
            <Button variant="outline" icon="download">
              엑셀다운로드
            </Button>
            
            <select
              value={perPage}
              onChange={(e) => setPerPage(e.target.value)}
              className="ml-2 bg-surface-container-low border border-outline-variant text-on-surface text-sm rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="100">100개 보기</option>
              <option value="200">200개 보기</option>
              <option value="500">500개 보기</option>
              <option value="1000">1000개 보기</option>
            </select>
          </div>
        </div>

        {/* 데이터 테이블 영역 */}
        <div className="overflow-x-auto border border-outline-variant rounded-md">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">번호</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">네이버상품번호</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">사진</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">공급사명</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">브랜드명</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider min-w-[200px]">공급상품명</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">공급가</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">판매가격</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">소분류</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">등록플랫폼/순이익</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">사용여부</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-sm text-on-surface bg-surface-container-lowest">
              {displayedProducts.map((product, idx) => (
                <tr key={product.id || idx} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-2 px-4 text-center">{idx + 1}</td>
                  <td className="py-2 px-4 font-medium text-primary">{product.naver_product_id}</td>
                  <td className="py-2 px-4 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {product.image_url ? (
                      <img src={product.image_url} alt="상품 이미지" className="w-10 h-10 object-cover border border-outline-variant rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-surface-variant rounded border border-outline-variant" />
                    )}
                  </td>
                  <td className="py-2 px-4">{product.supplier_name}</td>
                  <td className="py-2 px-4">{product.brand_name}</td>
                  <td className="py-2 px-4 font-medium truncate max-w-[250px]" title={product.supply_product_name}>{product.supply_product_name}</td>
                  <td className="py-2 px-4 text-right">₩{product.supply_price?.toLocaleString()}</td>
                  <td className="py-2 px-4 text-right font-semibold text-error">₩{product.sell_price?.toLocaleString()}</td>
                  <td className="py-2 px-4">{product.sub_category}</td>
                  <td className="py-2 px-4 text-secondary text-xs">
                    <div>{product.registered_platform}</div>
                    <div className="text-primary font-medium mt-0.5">₩{product.net_profit?.toLocaleString()}</div>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      product.is_used !== false
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {product.is_used !== false ? 'Y' : 'N'}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="text-primary hover:underline text-xs font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors">수정</button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-error hover:underline text-xs font-medium px-2 py-1 rounded hover:bg-error/10 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {displayedProducts.length === 0 && (
            <div className="py-12 text-center text-secondary">
              등록된 상품이 없습니다. 엑셀을 업로드하여 데이터를 추가해보세요.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
