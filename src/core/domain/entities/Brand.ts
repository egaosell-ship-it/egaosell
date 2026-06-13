export interface BrandProps {
  id?: string;
  userId: string;
  brandName: string;
  code: string;
  cafe24Code: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Brand {
  private props: BrandProps;

  private constructor(props: BrandProps) {
    this.props = props;
  }

  public static create(props: BrandProps): Brand {
    if (!props.brandName) {
      throw new Error("브랜드명은 필수입니다.");
    }
    if (!props.code) {
      throw new Error("코드는 필수입니다.");
    }
    if (!props.cafe24Code) {
      throw new Error("카페24코드는 필수입니다.");
    }
    if (!props.userId) {
      throw new Error("유저 ID는 필수입니다.");
    }

    return new Brand(props);
  }

  toPlainObj(): BrandProps {
    return { ...this.props };
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get brandName(): string {
    return this.props.brandName;
  }
  get code(): string {
    return this.props.code;
  }
  get cafe24Code(): string {
    return this.props.cafe24Code;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
