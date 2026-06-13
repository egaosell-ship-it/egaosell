export interface OwnedStoreProps {
  id?: string;
  userId: string;
  businessId: string;
  platformName: string;
  loginId: string;
  siteName: string;
  storeUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class OwnedStore {
  private props: OwnedStoreProps;

  private constructor(props: OwnedStoreProps) {
    this.props = {
      ...props,
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
