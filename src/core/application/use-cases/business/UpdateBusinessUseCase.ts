import { Business } from "../../../domain/entities/Business";
import { CreateBusinessDTO } from "../../dtos/BusinessDTO";
import { IBusinessRepository } from "../../interfaces/IBusinessRepository";

export interface UpdateBusinessDTO extends CreateBusinessDTO {
  id: string;
}

export class UpdateBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(dto: UpdateBusinessDTO, userId: string): Promise<void> {
    const business = Business.create({
      ...dto,
      userId,
      id: dto.id,
      updatedAt: new Date(),
    });

    await this.businessRepository.update(business);
  }
}
