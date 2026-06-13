import { IPlatformMarginRepository } from "@/core/application/interfaces/IPlatformMarginRepository";
import { PlatformMargin } from "@/core/domain/entities/PlatformMargin";
import { createClient } from "@/infrastructure/config/supabase/server";

export class SupabasePlatformMarginRepository implements IPlatformMarginRepository {
  async create(margin: PlatformMargin): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("platform_margins").insert({
      id: margin.id,
      user_id: margin.userId,
      business_id: margin.businessId,
      platform_name: margin.platformName,
      color_code: margin.colorCode,
      commission_rate: margin.commissionRate,
      shipping_fee: margin.shippingFee,
      other_costs: margin.otherCosts,
    });

    if (error) {
      throw new Error(`플랫폼 마진 생성 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async findByUserId(userId: string): Promise<PlatformMargin[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("platform_margins")
      .select("*, businesses:business_id(company_name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`플랫폼 마진 목록 조회 중 오류가 발생했습니다: ${error.message}`);
    }

    return (data || []).map((row: any) =>
      PlatformMargin.create({
        id: row.id,
        userId: row.user_id,
        businessId: row.business_id,
        platformName: row.platform_name,
        colorCode: row.color_code,
        commissionRate: Number(row.commission_rate),
        shippingFee: Number(row.shipping_fee),
        otherCosts: Number(row.other_costs),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      })
    );
  }

  async update(margin: PlatformMargin): Promise<void> {
    if (!margin.id) throw new Error("업데이트할 플랫폼 마진 ID가 없습니다.");

    const supabase = await createClient();
    const { error } = await supabase
      .from("platform_margins")
      .update({
        business_id: margin.businessId,
        platform_name: margin.platformName,
        color_code: margin.colorCode,
        commission_rate: margin.commissionRate,
        shipping_fee: margin.shippingFee,
        other_costs: margin.otherCosts,
      })
      .eq("id", margin.id)
      .eq("user_id", margin.userId);

    if (error) {
      throw new Error(`플랫폼 마진 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("platform_margins")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`플랫폼 마진 삭제 중 오류가 발생했습니다: ${error.message}`);
    }
  }
}
