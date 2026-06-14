export interface CreateProductCodeSettingDTO {
  platformName: string;
  supplierNameDelimiter1: string;
  supplierNameDelimiter2: string;
  priceInfoDelimiter: string;
}

export interface UpdateProductCodeSettingDTO extends CreateProductCodeSettingDTO {
  id: string;
}
