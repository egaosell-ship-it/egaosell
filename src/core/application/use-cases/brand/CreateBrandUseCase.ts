import { Brand } from "@/core/domain/entities/Brand";
import { CreateBrandDTO } from "@/core/application/dtos/BrandDTO";
import { IBrandRepository } from "@/core/application/interfaces/IBrandRepository";

export class CreateBrandUseCase {
  constructor(private readonly repository: IBrandRepository) {}

  async execute(dto: CreateBrandDTO, userId: string): Promise<void> {
    const brand = Brand.create({ ...dto, userId });
    await this.repository.create(brand);
  }
}
