"use server";

import { revalidatePath } from "next/cache";
import { CreateBrandUseCase } from "@/core/application/use-cases/brand/CreateBrandUseCase";
import { SupabaseBrandRepository } from "@/infrastructure/repositories/SupabaseBrandRepository";
import { createClient } from "@/infrastructure/config/supabase/server";
import { CreateBrandDTO } from "@/core/application/dtos/BrandDTO";

export async function createBrandAction(prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "로그인이 필요합니다." };
    }

    const dto: CreateBrandDTO = {
      brandName: formData.get("brandName") as string,
      code: formData.get("code") as string,
      cafe24Code: formData.get("cafe24Code") as string,
    };

    const repository = new SupabaseBrandRepository();
    const useCase = new CreateBrandUseCase(repository);

    await useCase.execute(dto, user.id);

    revalidatePath("/settings");

    return { success: true, message: "저장되었습니다." };
  } catch (error: unknown) {
    console.error("CreateBrand error:", error);
    return { success: false, message: (error as Error).message || "저장되지 않았습니다." };
  }
}
