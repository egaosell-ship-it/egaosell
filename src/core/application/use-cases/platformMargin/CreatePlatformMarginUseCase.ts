import { PlatformMargin } from "@/core/domain/entities/PlatformMargin";
import { CreatePlatformMarginDTO } from "@/core/application/dtos/PlatformMarginDTO";
import { IPlatformMarginRepository } from "@/core/application/interfaces/IPlatformMarginRepository";

export class CreatePlatformMarginUseCase {
  constructor(private readonly repository: IPlatformMarginRepository) {}

  async execute(dto: CreatePlatformMarginDTO, userId: string): Promise<void> {
    const margin = PlatformMargin.create({ ...dto, userId });
    await this.repository.create(margin);
  }
}
