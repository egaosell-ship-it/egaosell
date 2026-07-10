import { ICollectedProductRepository } from '../../interfaces/ICollectedProductRepository';
import { CollectedProductProps } from '../../../domain/entities/CollectedProduct';

export class GetCollectedProductsUseCase {
  constructor(private readonly repository: ICollectedProductRepository) {}

  async execute(userId: string): Promise<CollectedProductProps[]> {
    const products = await this.repository.getCollectedProducts(userId);
    return products.map(product => product.toJSON());
  }
}
