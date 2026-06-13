import { UpdatePlatformMarginDTO } from "../../dtos/PlatformMarginDTO";
import { IPlatformMarginRepository } from "../../interfaces/IPlatformMarginRepository";
import { PlatformMargin } from "../../../domain/entities/PlatformMargin";

export class UpdatePlatformMarginUseCase {
  constructor(private readonly repository: IPlatformMarginRepository) {}

  async execute(dto: UpdatePlatformMarginDTO, userId: string): Promise<void> {
    if (!dto.id) {
      throw new Error("마진 ID는 필수입니다.");
    }
    if (!dto.businessId) {
      throw new Error("사업자 ID는 필수입니다.");
    }
    if (!dto.platformName) {
      throw new Error("플랫폼명은 필수입니다.");
    }

    const platformMargin = PlatformMargin.create({
      id: dto.id,
      userId,
      businessId: dto.businessId,
      platformName: dto.platformName,
      colorCode: dto.colorCode,
      commissionRate: dto.commissionRate,
      shippingFee: dto.shippingFee,
      otherCosts: dto.otherCosts,
    });

    await this.repository.update(platformMargin);
  }
}
