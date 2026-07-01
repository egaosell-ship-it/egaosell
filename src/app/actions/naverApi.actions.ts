'use server';

import { revalidatePath } from "next/cache";
import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseNaverApiRepository } from "@/infrastructure/repositories/SupabaseNaverApiRepository";
import { CreateNaverApiUseCase } from "@/core/application/use-cases/naverApi/CreateNaverApiUseCase";
import { DeleteNaverApiUseCase } from "@/core/application/use-cases/naverApi/DeleteNaverApiUseCase";

export async function createNaverApiAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const businessId = formData.get('businessId') as string;
    const type = formData.get('type') as string;
    const appId = formData.get('appId') as string;
    const appSecret = formData.get('appSecret') as string;
    const apiIp = formData.get('apiIp') as string;
    const expireDateStr = formData.get('expireDate') as string;

    if (!businessId || !appId || !appSecret || !type) {
      return { success: false, error: '필수 항목이 누락되었습니다.' };
    }

    const repository = new SupabaseNaverApiRepository();
    const useCase = new CreateNaverApiUseCase(repository);

    const expireDate = expireDateStr ? new Date(expireDateStr) : null;

    await useCase.execute({
      userId: user.id,
      businessId,
      type,
      appId,
      appSecret,
      apiIp,
      expireDate
    });

    revalidatePath('/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Create Naver API Error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteNaverApiAction(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const repository = new SupabaseNaverApiRepository();
    const useCase = new DeleteNaverApiUseCase(repository);

    await useCase.execute(id);

    revalidatePath('/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Delete Naver API Error:', error);
    return { success: false, error: error.message };
  }
}
