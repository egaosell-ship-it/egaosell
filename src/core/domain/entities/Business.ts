export interface BusinessProps {
  id?: string;
  userId: string;
  isMain: boolean;
  companyName: string;
  businessId: string;
  ceoName: string;
  phone?: string | null;
  address?: string | null;
  regNumber?: string | null;
  mailOrderNumber?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Business {
  private props: BusinessProps;

  private constructor(props: BusinessProps) {
    this.props = props;
  }

  public static create(props: BusinessProps): Business {
    if (!props.companyName) {
      throw new Error("상호명은 필수입니다.");
    }
    if (!props.businessId) {
      throw new Error("사업자ID는 필수입니다.");
    }
    if (!props.ceoName) {
      throw new Error("대표자명은 필수입니다.");
    }
    if (!props.userId) {
      throw new Error("유저 ID는 필수입니다.");
    }

    return new Business(props);
  }

  toPlainObj(): BusinessProps {
    return { ...this.props };
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get isMain(): boolean {
    return this.props.isMain;
  }
  get companyName(): string {
    return this.props.companyName;
  }
  get businessId(): string {
    return this.props.businessId;
  }
  get ceoName(): string {
    return this.props.ceoName;
  }
  get phone(): string | null | undefined {
    return this.props.phone;
  }
  get address(): string | null | undefined {
    return this.props.address;
  }
  get regNumber(): string | null | undefined {
    return this.props.regNumber;
  }
  get mailOrderNumber(): string | null | undefined {
    return this.props.mailOrderNumber;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
