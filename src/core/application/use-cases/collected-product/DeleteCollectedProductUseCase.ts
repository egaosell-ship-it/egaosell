import { ICollectedProductRepository } from '../../interfaces/ICollectedProductRepository';

export class DeleteCollectedProductUseCase {
  constructor(private readonly repository: ICollectedProductRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) throw new Error('삭제할 상품의 ID가 필요합니다.');
    await this.repository.deleteCollectedProduct(id);
  }
}
