import { CollectedProduct } from '../../domain/entities/CollectedProduct';

export interface ICollectedProductRepository {
  /**
   * 로그인한 사용자의 수집된 상품 목록을 조회합니다.
   * @param userId 사용자 ID
   */
  getCollectedProducts(userId: string): Promise<CollectedProduct[]>;

  /**
   * 특정 수집된 상품 단건을 조회합니다.
   * @param id 상품 ID
   */
  getCollectedProductById(id: string): Promise<CollectedProduct | null>;

  /**
   * 수집된 상품 정보를 업데이트합니다. (상품명, 가격 등)
   * @param product 수정될 도메인 엔티티
   */
  updateCollectedProduct(product: CollectedProduct): Promise<void>;

  /**
   * 수집된 상품을 삭제합니다.
   * @param id 수집된 상품 ID (테이블 PK)
   */
  deleteCollectedProduct(id: string): Promise<void>;
}
