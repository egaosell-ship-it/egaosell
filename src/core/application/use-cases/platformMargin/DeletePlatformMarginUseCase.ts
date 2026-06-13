import { IPlatformMarginRepository } from "../../interfaces/IPlatformMarginRepository";

export class DeletePlatformMarginUseCase {
  constructor(private readonly repository: IPlatformMarginRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    if (!id) {
      throw new Error("마진 ID는 필수입니다.");
    }

    await this.repository.delete(id, userId);
  }
}
