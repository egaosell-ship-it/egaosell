import { CoupangApi } from "@/core/domain/entities/CoupangApi";
import { CreateCoupangApiDTO } from "@/core/application/dtos/CoupangApiDTO";
import { ICoupangApiRepository } from "@/core/application/interfaces/ICoupangApiRepository";

export class CreateCoupangApiUseCase {
  constructor(private readonly repository: ICoupangApiRepository) {}

  async execute(dto: CreateCoupangApiDTO, userId: string): Promise<void> {
    const expireDate = dto.expireDate ? new Date(dto.expireDate) : null;
    const api = CoupangApi.create({ ...dto, expireDate, userId });
    await this.repository.create(api);
  }
}
