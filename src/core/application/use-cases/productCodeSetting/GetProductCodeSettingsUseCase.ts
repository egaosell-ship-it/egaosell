import { IProductCodeSettingRepository } from "../../interfaces/IProductCodeSettingRepository";
import { ProductCodeSetting } from "../../../domain/entities/ProductCodeSetting";

export class GetProductCodeSettingsUseCase {
  constructor(private repository: IProductCodeSettingRepository) {}

  async execute(userId: string): Promise<ProductCodeSetting[]> {
    return this.repository.findByUserId(userId);
  }
}
