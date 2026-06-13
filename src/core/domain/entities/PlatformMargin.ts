export interface PlatformMarginProps {
  id?: string;
  userId: string;
  businessId: string;
  platformName: string;
  commissionRate: number;
  shippingFee: number;
  otherCosts: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PlatformMargin {
  private props: PlatformMarginProps;

  private constructor(props: PlatformMarginProps) {
    this.props = props;
  }

  public static create(props: PlatformMarginProps): PlatformMargin {
    if (!props.businessId) {
      throw new Error("상호(사업자)는 필수입니다.");
    }
    if (!props.platformName) {
      throw new Error("플랫폼명은 필수입니다.");
    }
    if (props.commissionRate < 0) {
      throw new Error("수수료는 0 이상이어야 합니다.");
    }
    if (props.shippingFee < 0) {
      throw new Error("배송비는 0 이상이어야 합니다.");
    }
    if (props.otherCosts < 0) {
      throw new Error("기타비용은 0 이상이어야 합니다.");
    }
    if (!props.userId) {
      throw new Error("유저 ID는 필수입니다.");
    }

    return new PlatformMargin(props);
  }

  toPlainObj(): PlatformMarginProps {
    return { ...this.props };
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get businessId(): string {
    return this.props.businessId;
  }
  get platformName(): string {
    return this.props.platformName;
  }
  get commissionRate(): number {
    return this.props.commissionRate;
  }
  get shippingFee(): number {
    return this.props.shippingFee;
  }
  get otherCosts(): number {
    return this.props.otherCosts;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
