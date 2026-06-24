import { IMemoRepository, CreateMemoDTO } from "../../interfaces/IMemoRepository";
import { Memo } from "../../../domain/entities/Memo";

export class CreateMemoUseCase {
  constructor(private readonly memoRepository: IMemoRepository) {}

  async execute(dto: CreateMemoDTO): Promise<Memo> {
    if (!dto.userId) {
      throw new Error("UserId is required.");
    }
    return this.memoRepository.createMemo(dto);
  }
}
