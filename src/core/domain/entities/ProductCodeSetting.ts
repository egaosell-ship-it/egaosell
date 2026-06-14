export interface ProductCodeSettingProps {
  id?: string;
  userId: string;
  platformName: string;
  supplierNameDelimiter1: string;
  supplierNameDelimiter2: string;
  priceInfoDelimiter: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProductCodeSetting {
  private props: ProductCodeSettingProps;

  private constructor(props: ProductCodeSettingProps) {
    this.props = props;
  }

  public static create(props: ProductCodeSettingProps): ProductCodeSetting {
    if (!props.userId) {
      throw new Error("유저 ID는 필수입니다.");
    }
    if (!props.platformName) {
      throw new Error("플랫폼명은 필수입니다.");
    }
    if (!props.supplierNameDelimiter1) {
      throw new Error("공급상품명구분자1은 필수입니다.");
    }
    if (!props.supplierNameDelimiter2) {
      throw new Error("공급상품명구분자2는 필수입니다.");
    }
    if (props.priceInfoDelimiter === undefined || props.priceInfoDelimiter === null) {
      props.priceInfoDelimiter = "";
    }

    return new ProductCodeSetting(props);
  }

  toPlainObj(): ProductCodeSettingProps {
    return { ...this.props };
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get platformName(): string {
    return this.props.platformName;
  }
  get supplierNameDelimiter1(): string {
    return this.props.supplierNameDelimiter1;
  }
  get supplierNameDelimiter2(): string {
    return this.props.supplierNameDelimiter2;
  }
  get priceInfoDelimiter(): string {
    return this.props.priceInfoDelimiter;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
