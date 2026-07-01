import { INaverApiRepository } from "../../interfaces/INaverApiRepository";

export class DeleteNaverApiUseCase {
  constructor(private naverApiRepository: INaverApiRepository) {}

  async execute(id: string): Promise<void> {
    return this.naverApiRepository.delete(id);
  }
}
