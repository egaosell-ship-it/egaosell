import { IMemoRepository, UpdateMemoDTO } from "../../interfaces/IMemoRepository";
import { Memo } from "../../../domain/entities/Memo";

export class UpdateMemoUseCase {
  constructor(private readonly memoRepository: IMemoRepository) {}

  async execute(dto: UpdateMemoDTO): Promise<Memo> {
    if (!dto.id || !dto.userId) {
      throw new Error("Id and UserId are required.");
    }
    return this.memoRepository.updateMemo(dto);
  }
}
