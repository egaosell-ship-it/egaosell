import { OwnedStore } from "../../../domain/entities/OwnedStore";
import { IOwnedStoreRepository } from "../../interfaces/IOwnedStoreRepository";

export class GetOwnedStoresUseCase {
  constructor(private readonly repository: IOwnedStoreRepository) {}

  async execute(userId: string): Promise<OwnedStore[]> {
    return this.repository.findByUserId(userId);
  }
}
