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
      console.error("Supabase insert error:", error);
      throw new Error("상품 데이터를 저장하는 중 오류가 발생했습니다.");
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
}
