import { IProductCodeSettingRepository } from "../../interfaces/IProductCodeSettingRepository";
import { ProductCodeSetting } from "../../../domain/entities/ProductCodeSetting";
import { UpdateProductCodeSettingDTO } from "../../dtos/ProductCodeSettingDTO";

export class UpdateProductCodeSettingUseCase {
  constructor(private repository: IProductCodeSettingRepository) {}

  async execute(userId: string, dto: UpdateProductCodeSettingDTO): Promise<void> {
    const setting = ProductCodeSetting.create({
      id: dto.id,
      userId,
      platformName: dto.platformName,
      supplierNameDelimiter1: dto.supplierNameDelimiter1,
      supplierNameDelimiter2: dto.supplierNameDelimiter2,
      priceInfoDelimiter: dto.priceInfoDelimiter,
    });

    await this.repository.update(setting);
  }
}
