import { IBusinessRepository } from "../../interfaces/IBusinessRepository";

export class DeleteBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    await this.businessRepository.delete(id, userId);
  }
}
