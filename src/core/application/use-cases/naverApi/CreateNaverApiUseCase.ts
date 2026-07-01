import { INaverApiRepository, CreateNaverApiDTO } from "../../interfaces/INaverApiRepository";
import { NaverApi } from "../../../domain/entities/NaverApi";

export class CreateNaverApiUseCase {
  constructor(private naverApiRepository: INaverApiRepository) {}

  async execute(data: CreateNaverApiDTO): Promise<NaverApi> {
    if (!data.businessId || !data.appId || !data.appSecret) {
      throw new Error("Missing required fields for Naver API");
    }
    return this.naverApiRepository.create(data);
  }
}
