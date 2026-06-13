import { PlatformMargin } from "@/core/domain/entities/PlatformMargin";
import { IPlatformMarginRepository } from "@/core/application/interfaces/IPlatformMarginRepository";

export class GetPlatformMarginsUseCase {
  constructor(private readonly repository: IPlatformMarginRepository) {}

  async execute(userId: string): Promise<PlatformMargin[]> {
    return await this.repository.findByUserId(userId);
  }
}
