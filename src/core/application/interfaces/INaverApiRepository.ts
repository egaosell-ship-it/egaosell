import { NaverApi } from "../../domain/entities/NaverApi";

export interface CreateNaverApiDTO {
  userId: string;
  businessId: string;
  type: string;
  appId: string;
  appSecret: string;
  apiIp?: string;
  expireDate?: Date | null;
}

export interface INaverApiRepository {
  findByUserId(userId: string): Promise<NaverApi[]>;
  create(data: CreateNaverApiDTO): Promise<NaverApi>;
  delete(id: string): Promise<void>;
}
