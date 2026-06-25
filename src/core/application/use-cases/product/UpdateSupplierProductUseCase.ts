import { ISupplierProductRepository } from "../../interfaces/ISupplierProductRepository";
import { SupplierProduct, SupplierProductProps } from "../../../domain/entities/SupplierProduct";

export class UpdateSupplierProductUseCase {
  constructor(private readonly repository: ISupplierProductRepository) {}

  /**
   * 상품 1건의 데이터를 수정합니다.
   * @param id 수정할 상품 ID
   * @param data 수정할 속성들
   * @returns 수정된 엔티티
   */
  public async execute(id: string, data: Partial<SupplierProductProps>): Promise<SupplierProduct> {
    if (!id) {
      throw new Error("상품 ID가 제공되지 않았습니다.");
    }
    
    // 비즈니스 로직(검증 등)이 필요하다면 여기에 추가
    if (data.sell_price != null && data.sell_price < 0) {
      throw new Error("판매가격은 0 이상이어야 합니다.");
    }
    if (data.supply_price != null && data.supply_price < 0) {
      throw new Error("공급가는 0 이상이어야 합니다.");
    }

    return await this.repository.update(id, data);
  }
}
