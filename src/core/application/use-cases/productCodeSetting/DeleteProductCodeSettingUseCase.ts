import { IProductCodeSettingRepository } from "../../interfaces/IProductCodeSettingRepository";

export class DeleteProductCodeSettingUseCase {
  constructor(private repository: IProductCodeSettingRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
