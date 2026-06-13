"use server";

import { revalidatePath } from "next/cache";
import { CreatePlatformMarginUseCase } from "@/core/application/use-cases/platformMargin/CreatePlatformMarginUseCase";
import { SupabasePlatformMarginRepository } from "@/infrastructure/repositories/SupabasePlatformMarginRepository";
import { createClient } from "@/infrastructure/config/supabase/server";
import { CreatePlatformMarginDTO } from "@/core/application/dtos/PlatformMarginDTO";

export async function createPlatformMarginAction(prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "로그인이 필요합니다." };
    }

    const dto: CreatePlatformMarginDTO = {
      businessId: formData.get("businessId") as string,
      platformName: formData.get("platformName") as string,
      colorCode: (formData.get("colorCode") as string) || "#E2E8F0",
      commissionRate: Number(formData.get("commissionRate") || 0),
      shippingFee: Number(formData.get("shippingFee") || 0),
      otherCosts: Number(formData.get("otherCosts") || 0),
    };

    const repository = new SupabasePlatformMarginRepository();
    const useCase = new CreatePlatformMarginUseCase(repository);

    await useCase.execute(dto, user.id);

    revalidatePath("/settings");

    return { success: true, message: "저장되었습니다." };
  } catch (error: unknown) {
    console.error("CreatePlatformMargin error:", error);
    return { success: false, message: (error as Error).message || "저장되지 않았습니다." };
  }
}
