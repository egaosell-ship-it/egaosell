export interface CreateOwnedStoreDTO {
  businessId: string;
  platformName: string;
  loginId: string;
  siteName: string;
  storeUrl: string;
}

export interface UpdateOwnedStoreDTO {
  id: string;
  businessId: string;
  platformName: string;
  loginId: string;
  siteName: string;
  storeUrl: string;
}
