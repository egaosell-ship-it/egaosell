import { IProductCodeSettingRepository } from "../../interfaces/IProductCodeSettingRepository";
import { ProductCodeSetting } from "../../../domain/entities/ProductCodeSetting";
import { CreateProductCodeSettingDTO } from "../../dtos/ProductCodeSettingDTO";

export class CreateProductCodeSettingUseCase {
  constructor(private repository: IProductCodeSettingRepository) {}

  async execute(userId: string, dto: CreateProductCodeSettingDTO): Promise<void> {
    const setting = ProductCodeSetting.create({
      userId,
      platformName: dto.platformName,
      supplierNameDelimiter1: dto.supplierNameDelimiter1,
      supplierNameDelimiter2: dto.supplierNameDelimiter2,
      priceInfoDelimiter: dto.priceInfoDelimiter,
    });

    await this.repository.create(setting);
  }
}
