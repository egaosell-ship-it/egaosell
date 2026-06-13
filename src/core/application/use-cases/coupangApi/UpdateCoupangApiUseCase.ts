import { CoupangApi } from "@/core/domain/entities/CoupangApi";
import { UpdateCoupangApiDTO } from "@/core/application/dtos/CoupangApiDTO";
import { ICoupangApiRepository } from "@/core/application/interfaces/ICoupangApiRepository";

export class UpdateCoupangApiUseCase {
  constructor(private readonly repository: ICoupangApiRepository) {}

  async execute(dto: UpdateCoupangApiDTO, userId: string): Promise<void> {
    const expireDate = dto.expireDate ? new Date(dto.expireDate) : null;
    const api = CoupangApi.create({ ...dto, expireDate, userId });
    await this.repository.update(api);
  }
}
