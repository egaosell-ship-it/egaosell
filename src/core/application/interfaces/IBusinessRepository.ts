import { Business } from "../../domain/entities/Business";

export interface IBusinessRepository {
  save(business: Business): Promise<void>;
  // Future methods:
  // findByUserId(userId: string): Promise<Business[]>;
  // update(business: Business): Promise<void>;
  // delete(id: string): Promise<void>;
}
