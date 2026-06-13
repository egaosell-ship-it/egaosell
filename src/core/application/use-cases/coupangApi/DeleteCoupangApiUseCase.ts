import { ICoupangApiRepository } from "@/core/application/interfaces/ICoupangApiRepository";

export class DeleteCoupangApiUseCase {
  constructor(private readonly repository: ICoupangApiRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    await this.repository.delete(id, userId);
  }
}
