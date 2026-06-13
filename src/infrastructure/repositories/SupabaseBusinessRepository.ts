import { Business } from "../../core/domain/entities/Business";
import { IBusinessRepository } from "../../core/application/interfaces/IBusinessRepository";
import { createClient } from "../config/supabase/server";

export class SupabaseBusinessRepository implements IBusinessRepository {
  async save(business: Business): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("businesses").insert({
      id: business.id,
      user_id: business.userId,
      is_main: business.isMain,
      company_name: business.companyName,
      business_id: business.businessId,
      ceo_name: business.ceoName,
      phone: business.phone,
      address: business.address,
      reg_number: business.regNumber,
      mail_order_number: business.mailOrderNumber,
      created_at: business.createdAt?.toISOString(),
      updated_at: business.updatedAt?.toISOString(),
    });

    if (error) {
      console.error("Failed to save business:", error);
      throw new Error("사업자 데이터 저장에 실패했습니다.");
    }
  }

  async findByUserId(userId: string): Promise<Business[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch businesses:", error);
      throw new Error("사업자 데이터 목록을 불러오는데 실패했습니다.");
    }

    return (data || []).map((row) =>
      Business.create({
        id: row.id,
        userId: row.user_id,
        isMain: row.is_main,
        companyName: row.company_name,
        businessId: row.business_id,
        ceoName: row.ceo_name,
        phone: row.phone,
        address: row.address,
        regNumber: row.reg_number,
        mailOrderNumber: row.mail_order_number,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      })
    );
  }
}
