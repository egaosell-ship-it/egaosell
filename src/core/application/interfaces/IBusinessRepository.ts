import { Business } from "../../domain/entities/Business";

export interface IBusinessRepository {
  save(business: Business): Promise<void>;
  findByUserId(userId: string): Promise<Business[]>;
  update(business: Business): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}
