import { SupplierProduct, SupplierProductProps } from "../../domain/entities/SupplierProduct";

export interface ISupplierProductRepository {
  /**
   * 대량의 상품을 한 번에 데이터베이스에 저장합니다.
   * @param products 저장할 상품 속성 배열
   */
  createMany(products: SupplierProductProps[]): Promise<SupplierProduct[]>;
  
  /**
   * 등록된 전체 상품 목록을 조회합니다.
   * @param options 페이지네이션 등의 추가 옵션 (추후 확장용)
   */
  findAll(options?: { limit?: number; offset?: number }): Promise<SupplierProduct[]>;
  
  /**
   * 상품 1개를 삭제합니다.
   * @param id 삭제할 상품 ID
   */
  delete(id: string): Promise<void>;

  /**
   * 상품 1개를 수정합니다.
   * @param id 수정할 상품 ID
   * @param data 수정할 상품 데이터
   */
  update(id: string, data: Partial<SupplierProductProps>): Promise<SupplierProduct>;

  /**
   * 등록된 전체 상품을 삭제합니다.
   */
  deleteAll(): Promise<void>;

  /**
   * 주어진 네이버 상품 ID 배열 중, 현재 사용자의 DB에 이미 등록되어 있는 ID들의 목록을 반환합니다.
   * @param naverProductIds 중복 여부를 검사할 네이버 상품 ID 배열
   */
  findDuplicatesByNaverIds(naverProductIds: string[]): Promise<string[]>;
}
