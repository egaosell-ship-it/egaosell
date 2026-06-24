import { ISupplierProductRepository } from "../../interfaces/ISupplierProductRepository";
import { SupplierProduct, SupplierProductProps } from "../../../domain/entities/SupplierProduct";

export class CreateSupplierProductsUseCase {
  constructor(private readonly repository: ISupplierProductRepository) {}

  public async execute(dtos: SupplierProductProps[]): Promise<SupplierProduct[]> {
    if (!dtos || dtos.length === 0) {
      throw new Error("저장할 데이터가 없습니다.");
    }
    
    // 비즈니스 로직: 필요한 경우 여기에서 DTO 검증 등을 수행할 수 있습니다.
    
    return await this.repository.createMany(dtos);
  }
}
