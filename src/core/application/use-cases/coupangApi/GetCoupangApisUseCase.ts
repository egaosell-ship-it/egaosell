import { CoupangApi } from "@/core/domain/entities/CoupangApi";
import { ICoupangApiRepository } from "@/core/application/interfaces/ICoupangApiRepository";

export class GetCoupangApisUseCase {
  constructor(private readonly repository: ICoupangApiRepository) {}

  async execute(userId: string): Promise<CoupangApi[]> {
    return await this.repository.findByUserId(userId);
  }
}
