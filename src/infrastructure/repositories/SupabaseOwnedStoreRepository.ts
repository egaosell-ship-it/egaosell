import { IOwnedStoreRepository } from "@/core/application/interfaces/IOwnedStoreRepository";
import { OwnedStore } from "@/core/domain/entities/OwnedStore";
import { createClient } from "@/infrastructure/config/supabase/server";

export class SupabaseOwnedStoreRepository implements IOwnedStoreRepository {
  async create(store: OwnedStore): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("owned_stores").insert({
      id: store.id,
      user_id: store.userId,
      business_id: store.businessId,
      platform_name: store.platformName,
      login_id: store.loginId,
      site_name: store.siteName,
      store_url: store.storeUrl,
      invoice_promo_1: store.invoicePromo1,
      invoice_promo_2: store.invoicePromo2,
    });

    if (error) {
      throw new Error(`보유스토어 생성 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async findByUserId(userId: string): Promise<OwnedStore[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("owned_stores")
      .select("*, businesses:business_id(company_name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`보유스토어 목록 조회 중 오류가 발생했습니다: ${error.message}`);
    }

    return (data || []).map((row: any) =>
      OwnedStore.create({
        id: row.id,
        userId: row.user_id,
        businessId: row.business_id,
        platformName: row.platform_name,
        loginId: row.login_id,
        siteName: row.site_name,
        storeUrl: row.store_url,
        invoicePromo1: row.invoice_promo_1,
        invoicePromo2: row.invoice_promo_2,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      })
    );
  }

  async update(store: OwnedStore): Promise<void> {
    if (!store.id) throw new Error("업데이트할 보유스토어 ID가 없습니다.");

    const supabase = await createClient();
    const { error } = await supabase
      .from("owned_stores")
      .update({
        business_id: store.businessId,
        platform_name: store.platformName,
        login_id: store.loginId,
        site_name: store.siteName,
        store_url: store.storeUrl,
        invoice_promo_1: store.invoicePromo1,
        invoice_promo_2: store.invoicePromo2,
        updated_at: new Date().toISOString(),
      })
      .eq("id", store.id)
      .eq("user_id", store.userId);

    if (error) {
      throw new Error(`보유스토어 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("owned_stores")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`보유스토어 삭제 중 오류가 발생했습니다: ${error.message}`);
    }
  }
}
