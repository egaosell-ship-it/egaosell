import { createClient } from "../config/supabase/server";
import { ProductCodeSetting } from "../../core/domain/entities/ProductCodeSetting";
import { IProductCodeSettingRepository } from "../../core/application/interfaces/IProductCodeSettingRepository";

export class SupabaseProductCodeSettingRepository implements IProductCodeSettingRepository {
  
  private mapToDomain(record: any): ProductCodeSetting {
    return ProductCodeSetting.create({
      id: record.id,
      userId: record.user_id,
      platformName: record.platform_name,
      supplierNameDelimiter1: record.supplier_name_delimiter_1,
      supplierNameDelimiter2: record.supplier_name_delimiter_2,
      priceInfoDelimiter: record.price_info_delimiter,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }

  async findByUserId(userId: string): Promise<ProductCodeSetting[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('product_code_settings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`ProductCodeSetting 조회 실패: ${error.message}`);
    return data ? data.map(this.mapToDomain) : [];
  }

  async findById(id: string): Promise<ProductCodeSetting | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('product_code_settings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw new Error(`ProductCodeSetting 상세 조회 실패: ${error.message}`);
    }
    
    return data ? this.mapToDomain(data) : null;
  }

  async create(setting: ProductCodeSetting): Promise<ProductCodeSetting> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('product_code_settings')
      .insert([{
        user_id: setting.userId,
        platform_name: setting.platformName,
        supplier_name_delimiter_1: setting.supplierNameDelimiter1,
        supplier_name_delimiter_2: setting.supplierNameDelimiter2,
        price_info_delimiter: setting.priceInfoDelimiter,
      }])
      .select()
      .single();

    if (error) throw new Error(`ProductCodeSetting 생성 실패: ${error.message}`);
    return this.mapToDomain(data);
  }

  async update(setting: ProductCodeSetting): Promise<ProductCodeSetting> {
    if (!setting.id) throw new Error("ID가 필요합니다.");
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('product_code_settings')
      .update({
        platform_name: setting.platformName,
        supplier_name_delimiter_1: setting.supplierNameDelimiter1,
        supplier_name_delimiter_2: setting.supplierNameDelimiter2,
        price_info_delimiter: setting.priceInfoDelimiter,
        updated_at: new Date().toISOString()
      })
      .eq('id', setting.id)
      .select()
      .single();

    if (error) throw new Error(`ProductCodeSetting 수정 실패: ${error.message}`);
    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('product_code_settings')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`ProductCodeSetting 삭제 실패: ${error.message}`);
  }
}
