import { ICollectedProductRepository } from '../../interfaces/ICollectedProductRepository';
import { CollectedProduct } from '../../../domain/entities/CollectedProduct';

export interface UpdateCollectedProductDTO {
  id: string;
  productName?: string;
  price?: number;
}

export class UpdateCollectedProductUseCase {
  constructor(private readonly repository: ICollectedProductRepository) {}

  async execute(dto: UpdateCollectedProductDTO): Promise<void> {
    if (!dto.id) throw new Error('수정할 상품의 ID가 필요합니다.');
    
    const product = await this.repository.getCollectedProductById(dto.id);
    if (!product) {
      throw new Error('해당 상품을 찾을 수 없습니다.');
    }

    if (dto.productName !== undefined) {
      product.updateName(dto.productName);
    }
    
    if (dto.price !== undefined) {
      product.updatePrice(dto.price);
    }

    await this.repository.updateCollectedProduct(product);
  }
}
