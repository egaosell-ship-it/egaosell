import { IOwnedStoreRepository } from "../../interfaces/IOwnedStoreRepository";

export class DeleteOwnedStoreUseCase {
  constructor(private readonly repository: IOwnedStoreRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    if (!id) throw new Error("ID는 필수입니다.");
    await this.repository.delete(id, userId);
  }
}
