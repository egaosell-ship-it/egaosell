import { ISupplierProductRepository } from "../../interfaces/ISupplierProductRepository";

export class DeleteAllSupplierProductsUseCase {
  constructor(private readonly repository: ISupplierProductRepository) {}

  public async execute(): Promise<void> {
    return this.repository.deleteAll();
  }
}
