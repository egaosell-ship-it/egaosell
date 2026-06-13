export interface CoupangApiProps {
  id?: string;
  userId: string;
  purpose: string;
  businessId: string;
  vendorCode: string;
  accessKey: string;
  secretKey: string;
  expireDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CoupangApi {
  private props: CoupangApiProps;

  private constructor(props: CoupangApiProps) {
    this.props = props;
  }

  public static create(props: CoupangApiProps): CoupangApi {
    if (!props.userId) {
      throw new Error("유저 ID는 필수입니다.");
    }
    if (!props.purpose) {
      throw new Error("사용목적은 필수입니다.");
    }
    if (!props.businessId) {
      throw new Error("상호(사업자)는 필수입니다.");
    }
    if (!props.vendorCode) {
      throw new Error("업체코드는 필수입니다.");
    }
    if (!props.accessKey) {
      throw new Error("Access Key는 필수입니다.");
    }
    if (!props.secretKey) {
      throw new Error("Secret Key는 필수입니다.");
    }

    return new CoupangApi(props);
  }

  toPlainObj(): CoupangApiProps {
    return { ...this.props };
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get purpose(): string {
    return this.props.purpose;
  }
  get businessId(): string {
    return this.props.businessId;
  }
  get vendorCode(): string {
    return this.props.vendorCode;
  }
  get accessKey(): string {
    return this.props.accessKey;
  }
  get secretKey(): string {
    return this.props.secretKey;
  }
  get expireDate(): Date | null | undefined {
    return this.props.expireDate;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
