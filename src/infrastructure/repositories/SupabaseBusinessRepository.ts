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
}
