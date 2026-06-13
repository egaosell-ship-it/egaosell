export interface CreatePlatformMarginDTO {
  businessId: string;
  platformName: string;
  colorCode: string;
  commissionRate: number;
  shippingFee: number;
  otherCosts: number;
}

export interface UpdatePlatformMarginDTO extends CreatePlatformMarginDTO {
  id: string;
}
