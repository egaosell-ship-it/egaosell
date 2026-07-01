import { createClient } from "../config/supabase/server";
import { INaverApiRepository, CreateNaverApiDTO } from "../../core/application/interfaces/INaverApiRepository";
import { NaverApi } from "../../core/domain/entities/NaverApi";

export class SupabaseNaverApiRepository implements INaverApiRepository {
  async findByUserId(userId: string): Promise<NaverApi[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("naver_apis")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    
    return data.map((item: any) => new NaverApi({
      id: item.id,
      userId: item.user_id,
      businessId: item.business_id,
      type: item.type,
      appId: item.app_id,
      appSecret: item.app_secret,
      apiIp: item.api_ip,
      expireDate: item.expire_date ? new Date(item.expire_date) : null,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }

  async create(dto: CreateNaverApiDTO): Promise<NaverApi> {
    const supabase = await createClient();
    
    // DB 저장 포맷에 맞게 변환 (camelCase -> snake_case)
    const insertData = {
      user_id: dto.userId,
      business_id: dto.businessId,
      type: dto.type,
      app_id: dto.appId,
      app_secret: dto.appSecret,
      api_ip: dto.apiIp,
      expire_date: dto.expireDate ? dto.expireDate.toISOString().split('T')[0] : null
    };

    const { data, error } = await supabase
      .from("naver_apis")
      .insert(insertData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    return new NaverApi({
      id: data.id,
      userId: data.user_id,
      businessId: data.business_id,
      type: data.type,
      appId: data.app_id,
      appSecret: data.app_secret,
      apiIp: data.api_ip,
      expireDate: data.expire_date ? new Date(data.expire_date) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    });
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("naver_apis")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}
