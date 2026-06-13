import { Business } from "../../../domain/entities/Business";
import { CreateBusinessDTO } from "../../dtos/BusinessDTO";
import { IBusinessRepository } from "../../interfaces/IBusinessRepository";

export class CreateBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(dto: CreateBusinessDTO, userId: string): Promise<void> {
    // 1. DTO와 userId를 기반으로 Domain Entity 생성 (유효성 검사 포함)
    const business = Business.create({
      ...dto,
      userId,
    });

    // 2. Repository를 통해 저장
    await this.businessRepository.save(business);
  }
}
