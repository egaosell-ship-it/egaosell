import { ISupplierProductRepository } from "../../interfaces/ISupplierProductRepository";
import { SupplierProduct } from "../../../domain/entities/SupplierProduct";

export class GetSupplierProductsUseCase {
  constructor(private readonly repository: ISupplierProductRepository) {}

  public async execute(): Promise<SupplierProduct[]> {
    return await this.repository.findAll();
  }
}
