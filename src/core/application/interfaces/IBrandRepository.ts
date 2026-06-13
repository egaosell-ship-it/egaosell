import { Brand } from "@/core/domain/entities/Brand";

export interface IBrandRepository {
  create(brand: Brand): Promise<void>;
  findByUserId(userId: string): Promise<Brand[]>;
  update(brand: Brand): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}
