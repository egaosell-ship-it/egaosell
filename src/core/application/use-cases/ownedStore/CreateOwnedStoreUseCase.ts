import { CreateOwnedStoreDTO } from "../../dtos/OwnedStoreDTO";
import { IOwnedStoreRepository } from "../../interfaces/IOwnedStoreRepository";
import { OwnedStore } from "../../../domain/entities/OwnedStore";

export class CreateOwnedStoreUseCase {
  constructor(private readonly repository: IOwnedStoreRepository) {}

  async execute(dto: CreateOwnedStoreDTO, userId: string): Promise<void> {
    if (!dto.businessId) throw new Error("사업자 ID는 필수입니다.");
    if (!dto.platformName) throw new Error("플랫폼명은 필수입니다.");
    if (!dto.loginId) throw new Error("로그인아이디는 필수입니다.");
    if (!dto.siteName) throw new Error("사이트명은 필수입니다.");
    if (!dto.storeUrl) throw new Error("스토어 URL은 필수입니다.");

    const store = OwnedStore.create({
      userId,
      businessId: dto.businessId,
      platformName: dto.platformName,
      loginId: dto.loginId,
      siteName: dto.siteName,
      storeUrl: dto.storeUrl,
    });

    await this.repository.create(store);
  }
}
