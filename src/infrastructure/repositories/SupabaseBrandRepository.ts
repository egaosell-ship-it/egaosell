import { IBrandRepository } from "@/core/application/interfaces/IBrandRepository";
import { Brand } from "@/core/domain/entities/Brand";
import { createClient } from "@/infrastructure/config/supabase/server";

export class SupabaseBrandRepository implements IBrandRepository {
  async create(brand: Brand): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("brands").insert({
      id: brand.id,
      user_id: brand.userId,
      brand_name: brand.brandName,
      code: brand.code,
      cafe24_code: brand.cafe24Code,
    });

    if (error) {
      throw new Error(`브랜드 생성 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async findByUserId(userId: string): Promise<Brand[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`브랜드 목록 조회 중 오류가 발생했습니다: ${error.message}`);
    }

    return (data || []).map((row) =>
      Brand.create({
        id: row.id,
        userId: row.user_id,
        brandName: row.brand_name,
        code: row.code,
        cafe24Code: row.cafe24_code,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      })
    );
  }

  async update(brand: Brand): Promise<void> {
    if (!brand.id) throw new Error("업데이트할 브랜드 ID가 없습니다.");

    const supabase = await createClient();
    const { error } = await supabase
      .from("brands")
      .update({
        brand_name: brand.brandName,
        code: brand.code,
        cafe24_code: brand.cafe24Code,
      })
      .eq("id", brand.id)
      .eq("user_id", brand.userId);

    if (error) {
      throw new Error(`브랜드 정보 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("brands")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`브랜드 삭제 중 오류가 발생했습니다: ${error.message}`);
    }
  }
}
