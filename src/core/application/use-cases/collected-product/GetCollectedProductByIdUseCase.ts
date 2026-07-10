import { ICollectedProductRepository } from '../../interfaces/ICollectedProductRepository';
import { CollectedProductProps } from '../../../domain/entities/CollectedProduct';

export class GetCollectedProductByIdUseCase {
  constructor(private readonly repository: ICollectedProductRepository) {}

  async execute(id: string): Promise<CollectedProductProps | null> {
    const product = await this.repository.getCollectedProductById(id);
    if (!product) return null;
    return product.toJSON();
  }
}
