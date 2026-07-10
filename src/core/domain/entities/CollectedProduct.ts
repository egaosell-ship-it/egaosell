export interface CollectedProductProps {
  id: string;
  userId: string;
  platform: string;
  productId: string;
  productName: string;
  price: number;
  imageUrl: string | null;
  detailImages: string[];
  description: string | null;
  reviews: string[];
  createdAt: string;
}

export class CollectedProduct {
  private props: CollectedProductProps;

  private constructor(props: CollectedProductProps) {
    this.props = props;
  }

  public static create(props: CollectedProductProps): CollectedProduct {
    return new CollectedProduct(props);
  }

  // Getters
  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get platform(): string { return this.props.platform; }
  get productId(): string { return this.props.productId; }
  get productName(): string { return this.props.productName; }
  get price(): number { return this.props.price; }
  get imageUrl(): string | null { return this.props.imageUrl; }
  get detailImages(): string[] { return this.props.detailImages; }
  get description(): string | null { return this.props.description; }
  get reviews(): string[] { return this.props.reviews; }
  get createdAt(): string { return this.props.createdAt; }

  // Setters (수정 가능한 필드)
  public updateName(newName: string): void {
    if (!newName.trim()) throw new Error('상품명은 필수입니다.');
    this.props.productName = newName;
  }

  public updatePrice(newPrice: number): void {
    if (newPrice < 0) throw new Error('가격은 0원 이상이어야 합니다.');
    this.props.price = newPrice;
  }

  public toJSON(): CollectedProductProps {
    return { ...this.props };
  }
}
