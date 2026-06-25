export interface SupplierProductProps {
  id?: string;
  user_id?: string;
  business_id?: string | null;
  naver_product_id?: string | null;
  image_url?: string | null;
  supplier_name?: string | null;
  brand_name?: string | null;
  supply_product_name: string;
  supply_price?: number | null;
  sell_price?: number | null;
  sub_category?: string | null;
  registered_platform?: string | null;
  net_profit?: number | null;
  is_used?: boolean;
  product_registered_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export class SupplierProduct {
  public id?: string;
  public user_id?: string;
  public business_id: string | null;
  public naver_product_id: string | null;
  public image_url: string | null;
  public supplier_name: string | null;
  public brand_name: string | null;
  public supply_product_name: string;
  public supply_price: number | null;
  public sell_price: number | null;
  public sub_category: string | null;
  public registered_platform: string | null;
  public net_profit: number | null;
  public is_used: boolean;
  public product_registered_at: string | null;
  public created_at?: string;
  public updated_at?: string;

  constructor(props: SupplierProductProps) {
    this.id = props.id;
    this.user_id = props.user_id;
    this.business_id = props.business_id ?? null;
    this.naver_product_id = props.naver_product_id ?? null;
    this.image_url = props.image_url ?? null;
    this.supplier_name = props.supplier_name ?? null;
    this.brand_name = props.brand_name ?? null;
    this.supply_product_name = props.supply_product_name;
    this.supply_price = props.supply_price ?? null;
    this.sell_price = props.sell_price ?? null;
    this.sub_category = props.sub_category ?? null;
    this.registered_platform = props.registered_platform ?? null;
    
    // 자동 계산 처리 (둘 다 존재할 때만 계산, 없으면 입력값 따르거나 0)
    if (props.net_profit !== undefined && props.net_profit !== null) {
      this.net_profit = props.net_profit;
    } else if (this.sell_price && this.supply_price) {
      this.net_profit = this.sell_price - this.supply_price;
    } else {
      this.net_profit = 0;
    }

    this.is_used = props.is_used ?? true;
    this.product_registered_at = props.product_registered_at ?? null;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public toJSON() {
    const obj: any = {
      user_id: this.user_id,
      business_id: this.business_id,
      naver_product_id: this.naver_product_id,
      image_url: this.image_url,
      supplier_name: this.supplier_name,
      brand_name: this.brand_name,
      supply_product_name: this.supply_product_name,
      supply_price: this.supply_price,
      sell_price: this.sell_price,
      sub_category: this.sub_category,
      registered_platform: this.registered_platform,
      net_profit: this.net_profit,
      is_used: this.is_used,
      product_registered_at: this.product_registered_at,
    };

    if (this.id !== undefined) obj.id = this.id;
    if (this.created_at !== undefined) obj.created_at = this.created_at;
    if (this.updated_at !== undefined) obj.updated_at = this.updated_at;

    return obj;
  }
}
