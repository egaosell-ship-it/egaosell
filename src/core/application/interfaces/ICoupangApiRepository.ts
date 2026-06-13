import { CoupangApi } from "@/core/domain/entities/CoupangApi";

export interface ICoupangApiRepository {
  create(api: CoupangApi): Promise<void>;
  findByUserId(userId: string): Promise<CoupangApi[]>;
  update(api: CoupangApi): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}
