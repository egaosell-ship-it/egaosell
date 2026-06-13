import { Business } from "../../../domain/entities/Business";
import { IBusinessRepository } from "../../interfaces/IBusinessRepository";

export class GetBusinessesUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(userId: string): Promise<Business[]> {
    return this.businessRepository.findByUserId(userId);
  }
}
