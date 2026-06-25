import { ISupplierProductRepository } from "../../core/application/interfaces/ISupplierProductRepository";
import { SupplierProduct, SupplierProductProps } from "../../core/domain/entities/SupplierProduct";
import { createClient } from "../config/supabase/server";

export class SupabaseSupplierProductRepository implements ISupplierProductRepository {
  public async createMany(productsProps: SupplierProductProps[]): Promise<SupplierProduct[]> {
    const supabase = await createClient();
    
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error("인증된 사용자가 아닙니다.");
    }
    
    // Entity 로 변환하여 비즈니스 로직(자동계산 등) 적용 후 DB 인서트용 객체로 변환
    const entities = productsProps.map(props => new SupplierProduct({ ...props, user_id: userData.user.id }));
    const insertData = entities.map(entity => entity.toJSON());
    
    const { data, error } = await supabase
      .from("supplier_products")
      .insert(insertData)
      .select();
      
    if (error) {
      // 42703 is PostgreSQL code for undefined_column
      if (error.code === '42703' || error.message.includes('does not exist')) {
        console.warn("DB schema mismatch detected. Retrying without new columns", error);
        const safeInsertData = insertData.map(obj => {
          const newObj = { ...obj };
          delete newObj.sub_category;
          delete newObj.product_registered_at;
          return newObj;
        });
        
        const retry = await supabase.from("supplier_products").insert(safeInsertData).select();
        if (retry.error) {
          throw new Error(`안전 모드 저장 중 오류가 발생했습니다: ${retry.error.message}`);
        }
        return retry.data.map(item => new SupplierProduct(item as any));
      }

      console.error("Supabase insert error:", error);
      throw new Error(`상품 데이터를 저장하는 중 오류가 발생했습니다: ${error.message}`);
    }
    
    return data.map(item => new SupplierProduct(item as any));
  }
  
  public async findAll(options?: { limit?: number; offset?: number }): Promise<SupplierProduct[]> {
    const supabase = await createClient();
    
    let query = supabase
      .from("supplier_products")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Supabase select error:", error);
      throw new Error("상품 목록을 불러오는 중 오류가 발생했습니다.");
    }
    
    return data.map(item => new SupplierProduct(item as any));
  }
  
  public async delete(id: string): Promise<void> {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("supplier_products")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Supabase delete error:", error);
      throw new Error("상품을 삭제하는 중 오류가 발생했습니다.");
    }
  }

  public async deleteAll(): Promise<void> {
    const supabase = await createClient();
    
    // user_id 를 가져와서 해당 사용자의 전체 데이터만 삭제
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error("인증된 사용자가 아닙니다.");
    }

    const { error } = await supabase
      .from("supplier_products")
      .delete()
      .eq("user_id", userData.user.id);
      
    if (error) {
      console.error("Supabase deleteAll error:", error);
      throw new Error("전체 상품을 삭제하는 중 오류가 발생했습니다.");
    }
  }

  public async findDuplicatesByNaverIds(naverProductIds: string[]): Promise<string[]> {
    if (!naverProductIds || naverProductIds.length === 0) return [];

    const supabase = await createClient();
    
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error("인증된 사용자가 아닙니다.");
    }

    const { data, error } = await supabase
      .from("supplier_products")
      .select("naver_product_id")
      .eq("user_id", userData.user.id)
      .in("naver_product_id", naverProductIds);

    if (error) {
      console.error("Supabase findDuplicates error:", error);
      throw new Error("상품 중복 여부를 검사하는 중 오류가 발생했습니다.");
    }

    return data.map(item => item.naver_product_id).filter(Boolean) as string[];
  }
}
