import { OwnedStore } from "../../domain/entities/OwnedStore";

export interface IOwnedStoreRepository {
  create(store: OwnedStore): Promise<void>;
  findByUserId(userId: string): Promise<OwnedStore[]>;
  update(store: OwnedStore): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}
