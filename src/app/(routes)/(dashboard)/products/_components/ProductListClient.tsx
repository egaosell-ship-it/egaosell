"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/common/Button";
import { Panel } from "@/components/common/Panel";
import { SupplierProductProps } from "@/core/domain/entities/SupplierProduct";
import { 
  uploadSupplierProductsAction, 
  deleteSupplierProductAction, 
  deleteAllSupplierProductsAction, 
  checkDuplicateSupplierProductsAction,
  updateSupplierProductAction
} from "@/app/actions/product.actions";
import { useRouter } from "next/navigation";

interface ProductListClientProps {
  initialProducts: SupplierProductProps[];
  mainBusinessName: string;
}

export function ProductListClient({ initialProducts, mainBusinessName }: ProductListClientProps) {
  const [perPage, setPerPage] = useState("100");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 필터 상태
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // 수정 팝업 관련 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SupplierProductProps | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("복사되었습니다!");
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      ["상품번호(스마트스토어)", "판매자상품코드", "채널", "할인가", "소분류", "브랜드명", "대표이미지 URL", "상품등록일"],
      ["13637842053", "6500-공급사2[품명2]", "스마트스토어", "16900", "슬리퍼", "없음", "http://shop1.phinf.naver.net/20260619_296/17818381673571nPnc_JPEG/115971032481416032_1618169434.JPG", "2026-06-19 13:13"],
      ["13637721027", "29000-공급사1[품명1]", "스마트스토어", "53900", "샌들", "나이키", "http://shop1.phinf.naver.net/20260619_227/1781852554468rIFEo_JPEG/115985388442584533_1797924226.jpg", "2026-06-19 11:39"]
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "엑셀양식.xlsx");
  };

  const handleExportExcel = () => {
    const header = ["상품번호(스마트스토어)", "판매자상품코드", "채널", "할인가", "소분류", "브랜드명", "대표이미지 URL", "상품등록일"];
    
    const rows = filteredProducts.map(p => {
      // "2026-06-19 13:52" 형태로 포맷팅
      let formattedDate = "";
      if (p.product_registered_at) {
        const d = new Date(p.product_registered_at);
        const pad = (n: number) => n.toString().padStart(2, '0');
        formattedDate = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      }

      return [
        p.naver_product_id || "",
        `${p.supply_price}-${p.supplier_name}[${p.supply_product_name}]`,
        p.registered_platform || "",
        p.sell_price || 0,
        p.sub_category || "",
        p.brand_name || "없음",
        p.image_url || "",
        formattedDate
      ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
    const today = new Date();
    const dateStr = `${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
    XLSX.writeFile(workbook, `상품목록-${dateStr}.xlsx`);
  };

  // 필터 적용
  const filteredProducts = initialProducts.filter(p => {
    if (selectedSupplier && p.supplier_name !== selectedSupplier) return false;
    if (selectedBrand && p.brand_name !== selectedBrand) return false;
    return true;
  });

  const limit = parseInt(perPage, 10);
  const totalPages = Math.ceil(filteredProducts.length / limit);
  // 현재 페이지가 전체 페이지보다 크면 방어
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const startIndex = (currentPage - 1) * limit;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  // 필터 목록 추출
  const uniqueSuppliers = Array.from(new Set(initialProducts.map(p => p.supplier_name).filter(Boolean))) as string[];
  const uniqueBrands = Array.from(new Set(initialProducts.map(p => p.brand_name).filter(Boolean))) as string[];

  // perPage 가 바뀔 때 1페이지로 리셋
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(e.target.value);
    setCurrentPage(1);
  };

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
            
            let registered_platform = row[2] ? String(row[2]) : null;
            if (registered_platform === "스마트스토어") {
              registered_platform = "네이버";
            }
            
            const sellPriceRaw = row[3] ? parseInt(String(row[3]).replace(/,/g, ''), 10) : 0;
            const sell_price = isNaN(sellPriceRaw) ? 0 : sellPriceRaw;
            const sub_category = row[4] ? String(row[4]) : null;
            const brand_name = row[5] ? String(row[5]) : null;
            const image_url = row[6] ? String(row[6]) : null;
            // 엑셀의 '상품등록일' 을 product_registered_at 으로 저장
            let product_registered_at: string | null = null;
            if (row[7]) {
              if (typeof row[7] === 'number') {
                // 엑셀 날짜 일련번호 (Serial number) 처리
                const dateObj = new Date(Math.round((row[7] - 25569) * 86400 * 1000));
                if (!isNaN(dateObj.getTime())) {
                  product_registered_at = dateObj.toISOString();
                }
              } else {
                const dateStr = String(row[7]).replace(/\./g, '-');
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) {
                  product_registered_at = d.toISOString();
                }
                // 변환 실패 시 DB 저장을 위해 null 유지
              }
            }
            
            // "공급가-공급사명[공급상품명]" 형식 파싱 (예: "5800-엘유티[아린]")
            let supply_price = 0;
            let supplier_name = "";
            let supply_product_name = originalProductName;

            const regex = /^(\d+)-(.*?)\[(.*?)\]$/;
            const match = originalProductName.match(regex);

            if (match) {
              const sp = parseInt(match[1], 10);
              supply_price = isNaN(sp) ? 0 : sp;
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
              product_registered_at,
              // net_profit 은 백엔드(Entity)에서 자동 계산됨
              is_used: true
            });
          }

          if (newProducts.length === 0) {
            alert("저장할 데이터가 없습니다.");
            setIsUploading(false);
            return;
          }

          // 네이버 상품 번호 중복 검사
          const naverProductIds = newProducts.map(p => p.naver_product_id).filter(Boolean) as string[];
          if (naverProductIds.length > 0) {
            const checkResult = await checkDuplicateSupplierProductsAction(naverProductIds);
            if (checkResult.success && checkResult.duplicates && checkResult.duplicates.length > 0) {
              alert(`이미 등록되어 있는 동일한 상품이 ${checkResult.duplicates.length}개 존재합니다. 업로드를 취소합니다.`);
              setIsUploading(false);
              return;
            }
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

  const handleEditClick = (product: SupplierProductProps) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingProduct) return;
    const { name, value, type } = e.target;
    
    if (type === 'radio') {
      const radioValue = (e.target as HTMLInputElement).value;
      setEditingProduct({ ...editingProduct, [name]: radioValue === 'true' });
    } else if (type === 'number') {
      setEditingProduct({ ...editingProduct, [name]: Number(value) });
    } else {
      setEditingProduct({ ...editingProduct, [name]: value });
    }
  };

  const handleEditSave = async () => {
    if (!editingProduct || !editingProduct.id) return;
    setIsSaving(true);
    
    const result = await updateSupplierProductAction(editingProduct.id, editingProduct);
    if (result.success) {
      alert("수정되었습니다.");
      setIsEditModalOpen(false);
      setEditingProduct(null);
      router.refresh();
    } else {
      alert(`수정 중 오류가 발생했습니다: ${result.error}`);
    }
    setIsSaving(false);
  };

  const handleDeleteAll = async () => {
    if (!confirm("모든 상품을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) return;
    
    // 안전을 위해 한번 더 확인
    const passcode = prompt("정말로 전체 삭제를 진행하려면 '삭제' 라고 입력해주세요.");
    if (passcode !== "삭제") {
      alert("전체 삭제가 취소되었습니다.");
      return;
    }
    
    const result = await deleteAllSupplierProductsAction();
    if (result.success) {
      alert("모든 상품이 삭제되었습니다.");
      router.refresh();
    } else {
      alert(`삭제 오류: ${result.error}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <Panel>
        <h2 className="text-xl font-bold text-on-surface mb-2">공급사 상품 목록({mainBusinessName})</h2>
        
        {/* 필터 영역 */}
        <div className="mb-6 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant text-sm">
          <div className="flex flex-wrap gap-2 items-center mb-3">
            <span className="font-bold text-on-surface w-16">공급사:</span>
            <button 
              onClick={() => { setSelectedSupplier(null); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedSupplier === null ? 'bg-primary text-white' : 'text-secondary bg-surface-variant hover:bg-surface-variant/80'}`}
            >
              전체
            </button>
            {uniqueSuppliers.map(sup => (
              <button 
                key={sup}
                onClick={() => { setSelectedSupplier(sup); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedSupplier === sup ? 'bg-primary text-white' : 'text-secondary bg-surface-variant hover:bg-surface-variant/80'}`}
              >
                {sup}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-bold text-on-surface w-16">브랜드:</span>
            <button 
              onClick={() => { setSelectedBrand(null); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedBrand === null ? 'bg-primary text-white' : 'text-secondary bg-surface-variant hover:bg-surface-variant/80'}`}
            >
              전체
            </button>
            {uniqueBrands.map(br => (
              <button 
                key={br}
                onClick={() => { setSelectedBrand(br); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedBrand === br ? 'bg-primary text-white' : 'text-secondary bg-surface-variant hover:bg-surface-variant/80'}`}
              >
                {br}
              </button>
            ))}
          </div>
        </div>

        {/* 상단 컨트롤 영역 */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold text-on-surface">
            총 <span className="text-primary font-bold">{filteredProducts.length.toLocaleString()}</span>개의 상품
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
              icon="delete_sweep" 
              onClick={handleDeleteAll}
              className="border-red-300 text-red-500 hover:bg-red-50"
            >
              전체삭제
            </Button>
            <Button 
              variant="outline" 
              icon="upload" 
              onClick={handleFileUploadClick}
              disabled={isUploading}
            >
              {isUploading ? "업로드 중..." : "엑셀업로드"}
            </Button>
            <Button 
              variant="outline" 
              icon="download"
              onClick={handleDownloadTemplate}
            >
              엑셀업로드양식
            </Button>
            <Button variant="outline" icon="download" onClick={handleExportExcel}>
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
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider">상호</th>
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
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">등록날짜</th>
                <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-sm text-on-surface bg-surface-container-lowest">
              {displayedProducts.map((product, idx) => (
                <tr key={product.id || idx} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-2 px-4 text-center">{idx + 1 + startIndex}</td>
                  <td className="py-2 px-4 font-medium text-on-surface">{mainBusinessName}</td>
                  <td className="py-2 px-4 font-medium text-primary">
                    {product.naver_product_id ? (
                      <a href={`https://smartstore.naver.com/actionrun/products/${product.naver_product_id}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {product.naver_product_id}
                      </a>
                    ) : '-'}
                  </td>
                  <td className="py-2 px-4 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {product.image_url ? (
                      <a href={product.image_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                        <img 
                          src={`/api/proxy-image?url=${encodeURIComponent(product.image_url)}`} 
                          alt="상품 이미지" 
                          className="w-10 h-10 object-cover border border-outline-variant rounded" 
                        />
                      </a>
                    ) : (
                      <div className="w-10 h-10 bg-surface-variant rounded border border-outline-variant" />
                    )}
                  </td>
                  <td className="py-2 px-4">{product.supplier_name}</td>
                  <td className="py-2 px-4">{product.brand_name}</td>
                  <td className="py-2 px-4 font-medium truncate max-w-[250px]" title="클릭하여 복사">
                    <div 
                      onClick={() => handleCopy(product.supply_product_name)} 
                      className="cursor-pointer hover:underline text-on-surface"
                    >
                      {product.supply_product_name}
                    </div>
                  </td>
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
                  <td className="py-2 px-4 text-center text-sm text-secondary">
                    {product.product_registered_at ? new Date(product.product_registered_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={() => handleEditClick(product)} 
                        className="text-primary hover:text-primary-fixed-variant text-xs font-medium mr-2 cursor-pointer"
                      >
                        수정
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="text-error hover:text-error/80 text-xs font-medium cursor-pointer disabled:cursor-not-allowed"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayedProducts.length === 0 && (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-secondary">
                    등록된 상품이 없습니다. 엑셀을 업로드해주세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-1 items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-secondary hover:text-primary disabled:opacity-50 disabled:hover:text-secondary cursor-pointer"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === p 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-secondary hover:bg-surface-variant'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-secondary hover:text-primary disabled:opacity-50 disabled:hover:text-secondary cursor-pointer"
            >
              다음
            </button>
          </div>
        )}
      </Panel>

      {/* 맨 위로 스크롤 버튼 (고정) */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer"
        title="맨 위로"
      >
        <span className="material-symbols-outlined">arrow_upward</span>
      </button>

      {/* 수정 모달 팝업 */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-[90vw] sm:w-[450px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface shrink-0">
              <h3 className="text-lg font-bold text-on-surface whitespace-nowrap">상품 수정</h3>
              <button onClick={handleModalClose} className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center rounded-full p-1 hover:bg-error/10">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[65vh]">
              {/* 사용여부 라디오 버튼 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">사용여부</label>
                <div className="flex gap-4 items-center h-[42px]">
                  <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
                    <input 
                      type="radio" 
                      name="is_used" 
                      value="true" 
                      checked={editingProduct.is_used === true} 
                      onChange={handleEditChange}
                      className="w-4 h-4 text-primary focus:ring-primary accent-primary cursor-pointer"
                    /> YES
                  </label>
                  <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
                    <input 
                      type="radio" 
                      name="is_used" 
                      value="false" 
                      checked={editingProduct.is_used === false} 
                      onChange={handleEditChange}
                      className="w-4 h-4 text-primary focus:ring-primary accent-primary cursor-pointer"
                    /> NO
                  </label>
                </div>
              </div>

              {/* 네이버상품번호 (수정 불가) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">네이버상품번호</label>
                <input 
                  type="text" 
                  value={editingProduct.naver_product_id || ''} 
                  readOnly 
                  className="border border-outline-variant rounded p-2.5 text-sm bg-surface-container-low text-on-surface-variant w-full outline-none"
                />
              </div>

              {/* 입력 항목들 */}
              {[
                { label: '공급가', name: 'supply_price', type: 'number' },
                { label: '공급사명', name: 'supplier_name', type: 'text' },
                { label: '공급상품명', name: 'supply_product_name', type: 'text' },
                { label: '판매가격', name: 'sell_price', type: 'number' },
                { label: '소분류', name: 'sub_category', type: 'text' },
                { label: '브랜드명', name: 'brand_name', type: 'text' },
                { label: '대표이미지 URL', name: 'image_url', type: 'text' },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant whitespace-nowrap">{field.label}</label>
                  <input 
                    type={field.type} 
                    name={field.name}
                    value={(editingProduct as any)[field.name] || ''} 
                    onChange={handleEditChange}
                    className="border border-outline-variant rounded p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface transition-all w-full"
                  />
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-2 bg-surface-container-low shrink-0">
              <button 
                type="button"
                onClick={handleModalClose} 
                disabled={isSaving}
                className="px-4 py-2 rounded text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container-lowest active:scale-95 transition-all whitespace-nowrap disabled:opacity-50 cursor-pointer"
              >
                취소
              </button>
              <Button onClick={handleEditSave} disabled={isSaving}>
                {isSaving ? "저장 중..." : "저장"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
