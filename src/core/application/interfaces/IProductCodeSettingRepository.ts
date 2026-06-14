import { ProductCodeSetting } from "../../domain/entities/ProductCodeSetting";

export interface IProductCodeSettingRepository {
  findByUserId(userId: string): Promise<ProductCodeSetting[]>;
  findById(id: string): Promise<ProductCodeSetting | null>;
  create(setting: ProductCodeSetting): Promise<ProductCodeSetting>;
  update(setting: ProductCodeSetting): Promise<ProductCodeSetting>;
  delete(id: string): Promise<void>;
}
