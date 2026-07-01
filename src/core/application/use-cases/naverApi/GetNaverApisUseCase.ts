import { INaverApiRepository } from "../../interfaces/INaverApiRepository";
import { NaverApi } from "../../../domain/entities/NaverApi";

export class GetNaverApisUseCase {
  constructor(private naverApiRepository: INaverApiRepository) {}

  async execute(userId: string): Promise<NaverApi[]> {
    return this.naverApiRepository.findByUserId(userId);
  }
}
