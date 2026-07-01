export interface NaverApiProps {
  id: string;
  userId: string;
  businessId: string;
  type: string;
  appId: string;
  appSecret: string;
  apiIp?: string | null;
  expireDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class NaverApi {
  private props: NaverApiProps;

  constructor(props: NaverApiProps) {
    this.props = props;
  }

  get id() { return this.props.id; }
  get userId() { return this.props.userId; }
  get businessId() { return this.props.businessId; }
  get type() { return this.props.type; }
  get appId() { return this.props.appId; }
  get appSecret() { return this.props.appSecret; }
  get apiIp() { return this.props.apiIp; }
  get expireDate() { return this.props.expireDate; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  public toPlainObj() {
    return {
      id: this.id,
      userId: this.userId,
      businessId: this.businessId,
      type: this.type,
      appId: this.appId,
      appSecret: this.appSecret,
      apiIp: this.apiIp,
      expireDate: this.expireDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
