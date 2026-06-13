export interface OwnedStoreProps {
  id?: string;
  userId: string;
  businessId: string;
  platformName: string;
  loginId: string;
  siteName: string;
  storeUrl: string;
  invoicePromo1?: string;
  invoicePromo2?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class OwnedStore {
  private props: OwnedStoreProps;

  private constructor(props: OwnedStoreProps) {
    this.props = {
      ...props,
      invoicePromo1: props.invoicePromo1 || "",
      invoicePromo2: props.invoicePromo2 || "",
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  static create(props: OwnedStoreProps): OwnedStore {
    return new OwnedStore(props);
  }

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

  get loginId(): string {
    return this.props.loginId;
  }

  get siteName(): string {
    return this.props.siteName;
  }

  get storeUrl(): string {
    return this.props.storeUrl;
  }

  get invoicePromo1(): string {
    return this.props.invoicePromo1 || "";
  }

  get invoicePromo2(): string {
    return this.props.invoicePromo2 || "";
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  toPlainObj(): OwnedStoreProps {
    return { ...this.props };
  }
}
