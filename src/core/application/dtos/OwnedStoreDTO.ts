export interface CreateOwnedStoreDTO {
  businessId: string;
  platformName: string;
  loginId: string;
  siteName: string;
  storeUrl: string;
  invoicePromo1?: string;
  invoicePromo2?: string;
}

export interface UpdateOwnedStoreDTO {
  id: string;
  businessId: string;
  platformName: string;
  loginId: string;
  siteName: string;
  storeUrl: string;
  invoicePromo1?: string;
  invoicePromo2?: string;
}
