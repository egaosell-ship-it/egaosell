export interface CreateBrandDTO {
  brandName: string;
  code: string;
  cafe24Code: string;
}

export interface UpdateBrandDTO extends CreateBrandDTO {
  id: string;
}
