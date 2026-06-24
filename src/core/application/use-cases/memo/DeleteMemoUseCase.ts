import { IMemoRepository } from "../../interfaces/IMemoRepository";

export class DeleteMemoUseCase {
  constructor(private readonly memoRepository: IMemoRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    if (!id || !userId) {
      throw new Error("Id and UserId are required.");
    }
    return this.memoRepository.deleteMemo(id, userId);
  }
}
