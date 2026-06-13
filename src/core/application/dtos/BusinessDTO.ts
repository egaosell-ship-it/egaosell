export interface CreateBusinessDTO {
  isMain: boolean;
  companyName: string;
  businessId: string;
  ceoName: string;
  phone?: string | null;
  address?: string | null;
  regNumber?: string | null;
  mailOrderNumber?: string | null;
}
