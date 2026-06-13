"use server";

import { revalidatePath } from "next/cache";
import { CreateBusinessUseCase } from "@/core/application/use-cases/business/CreateBusinessUseCase";
import { SupabaseBusinessRepository } from "@/infrastructure/repositories/SupabaseBusinessRepository";
import { createClient } from "@/infrastructure/config/supabase/server";
import { CreateBusinessDTO } from "@/core/application/dtos/BusinessDTO";

export async function createBusinessAction(prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "로그인이 필요합니다." };
    }

    const dto: CreateBusinessDTO = {
      isMain: formData.get("isMain") === "on",
      companyName: formData.get("companyName") as string,
      businessId: formData.get("businessId") as string,
      ceoName: formData.get("ceoName") as string,
      phone: formData.get("phone") as string || null,
      address: formData.get("address") as string || null,
      regNumber: formData.get("regNumber") as string || null,
      mailOrderNumber: formData.get("mailOrderNumber") as string || null,
    };

    const repository = new SupabaseBusinessRepository();
    const useCase = new CreateBusinessUseCase(repository);

    await useCase.execute(dto, user.id);

    revalidatePath("/settings"); // Refresh settings page data if needed

    return { success: true, message: "저장되었습니다." };
  } catch (error: unknown) {
    console.error("CreateBusiness error:", error);
    return { success: false, message: (error as Error).message || "저장되지 않았습니다." };
  }
}
