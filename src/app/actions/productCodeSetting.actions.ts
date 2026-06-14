"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseProductCodeSettingRepository } from "@/infrastructure/repositories/SupabaseProductCodeSettingRepository";
import { CreateProductCodeSettingUseCase } from "@/core/application/use-cases/productCodeSetting/CreateProductCodeSettingUseCase";
import { UpdateProductCodeSettingUseCase } from "@/core/application/use-cases/productCodeSetting/UpdateProductCodeSettingUseCase";
import { DeleteProductCodeSettingUseCase } from "@/core/application/use-cases/productCodeSetting/DeleteProductCodeSettingUseCase";

function getUserIdOrThrow(user: any) {
  if (!user) throw new Error("Unauthorized");
  return user.id;
}

export async function createProductCodeSettingAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = getUserIdOrThrow(user);

    const dto = {
      platformName: formData.get("platformName") as string,
      supplierNameDelimiter1: formData.get("supplierNameDelimiter1") as string || "[",
      supplierNameDelimiter2: formData.get("supplierNameDelimiter2") as string || "]",
      priceInfoDelimiter: formData.get("priceInfoDelimiter") as string || "-",
    };

    const repository = new SupabaseProductCodeSettingRepository();
    const useCase = new CreateProductCodeSettingUseCase(repository);

    await useCase.execute(userId, dto);
    
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProductCodeSettingAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = getUserIdOrThrow(user);

    const dto = {
      id: formData.get("id") as string,
      platformName: formData.get("platformName") as string,
      supplierNameDelimiter1: formData.get("supplierNameDelimiter1") as string || "[",
      supplierNameDelimiter2: formData.get("supplierNameDelimiter2") as string || "]",
      priceInfoDelimiter: formData.get("priceInfoDelimiter") as string || "-",
    };

    if (!dto.id) throw new Error("ID가 누락되었습니다.");

    const repository = new SupabaseProductCodeSettingRepository();
    const useCase = new UpdateProductCodeSettingUseCase(repository);

    await useCase.execute(userId, dto);
    
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProductCodeSettingAction(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    getUserIdOrThrow(user);

    const repository = new SupabaseProductCodeSettingRepository();
    const useCase = new DeleteProductCodeSettingUseCase(repository);

    await useCase.execute(id);
    
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
