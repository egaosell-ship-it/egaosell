import { Brand } from "@/core/domain/entities/Brand";
import { IBrandRepository } from "@/core/application/interfaces/IBrandRepository";

export class GetBrandsUseCase {
  constructor(private readonly repository: IBrandRepository) {}

  async execute(userId: string): Promise<Brand[]> {
    return await this.repository.findByUserId(userId);
  }
}
