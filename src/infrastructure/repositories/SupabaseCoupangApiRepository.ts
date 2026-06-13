import { ICoupangApiRepository } from "@/core/application/interfaces/ICoupangApiRepository";
import { CoupangApi } from "@/core/domain/entities/CoupangApi";
import { createClient } from "@/infrastructure/config/supabase/server";

export class SupabaseCoupangApiRepository implements ICoupangApiRepository {
  async create(api: CoupangApi): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("coupang_apis").insert({
      id: api.id,
      user_id: api.userId,
      purpose: api.purpose,
      business_id: api.businessId,
      vendor_code: api.vendorCode,
      access_key: api.accessKey,
      secret_key: api.secretKey,
      expire_date: api.expireDate ? api.expireDate.toISOString().split("T")[0] : null,
    });

    if (error) {
      throw new Error(`쿠팡 API 생성 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async findByUserId(userId: string): Promise<CoupangApi[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupang_apis")
      .select("*, businesses:business_id(company_name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`쿠팡 API 목록 조회 중 오류가 발생했습니다: ${error.message}`);
    }

    return (data || []).map((row: any) =>
      CoupangApi.create({
        id: row.id,
        userId: row.user_id,
        purpose: row.purpose,
        businessId: row.business_id,
        vendorCode: row.vendor_code,
        accessKey: row.access_key,
        secretKey: row.secret_key,
        expireDate: row.expire_date ? new Date(row.expire_date) : null,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      })
    );
  }

  async update(api: CoupangApi): Promise<void> {
    if (!api.id) throw new Error("업데이트할 쿠팡 API ID가 없습니다.");

    const supabase = await createClient();
    const { error } = await supabase
      .from("coupang_apis")
      .update({
        purpose: api.purpose,
        business_id: api.businessId,
        vendor_code: api.vendorCode,
        access_key: api.accessKey,
        secret_key: api.secretKey,
        expire_date: api.expireDate ? api.expireDate.toISOString().split("T")[0] : null,
      })
      .eq("id", api.id)
      .eq("user_id", api.userId);

    if (error) {
      throw new Error(`쿠팡 API 정보 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("coupang_apis")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`쿠팡 API 삭제 중 오류가 발생했습니다: ${error.message}`);
    }
  }
}
