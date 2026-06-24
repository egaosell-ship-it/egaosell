import { IMemoRepository } from "../../interfaces/IMemoRepository";
import { Memo } from "../../../domain/entities/Memo";

export class GetMemosUseCase {
  constructor(private readonly memoRepository: IMemoRepository) {}

  async execute(userId: string): Promise<Memo[]> {
    if (!userId) {
      throw new Error("UserId is required.");
    }
    return this.memoRepository.getMemosByUserId(userId);
  }
}
