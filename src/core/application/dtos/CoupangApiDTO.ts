export interface CreateCoupangApiDTO {
  purpose: string;
  businessId: string;
  vendorCode: string;
  accessKey: string;
  secretKey: string;
  expireDate?: string | null; // e.g. "2025-12-31" or ISO string
}

export interface UpdateCoupangApiDTO extends CreateCoupangApiDTO {
  id: string;
}
