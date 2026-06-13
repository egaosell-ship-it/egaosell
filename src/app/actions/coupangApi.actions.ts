"use server";

import { revalidatePath } from "next/cache";
import { CreateCoupangApiUseCase } from "@/core/application/use-cases/coupangApi/CreateCoupangApiUseCase";
import { UpdateCoupangApiUseCase } from "@/core/application/use-cases/coupangApi/UpdateCoupangApiUseCase";
import { DeleteCoupangApiUseCase } from "@/core/application/use-cases/coupangApi/DeleteCoupangApiUseCase";
import { SupabaseCoupangApiRepository } from "@/infrastructure/repositories/SupabaseCoupangApiRepository";
import { createClient } from "@/infrastructure/config/supabase/server";
import { CreateCoupangApiDTO, UpdateCoupangApiDTO } from "@/core/application/dtos/CoupangApiDTO";

export async function createCoupangApiAction(prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "로그인이 필요합니다." };
    }

    const dto: CreateCoupangApiDTO = {
      purpose: formData.get("purpose") as string || "OPEN API",
      businessId: formData.get("businessId") as string,
      vendorCode: formData.get("vendorCode") as string,
      accessKey: formData.get("accessKey") as string,
      secretKey: formData.get("secretKey") as string,
      expireDate: formData.get("expireDate") as string || null,
    };

    const repository = new SupabaseCoupangApiRepository();
    const useCase = new CreateCoupangApiUseCase(repository);

    await useCase.execute(dto, user.id);
    revalidatePath("/settings");

    return { success: true, message: "저장되었습니다." };
  } catch (error: unknown) {
    console.error("CreateCoupangApi error:", error);
    return { success: false, message: (error as Error).message || "저장되지 않았습니다." };
  }
}

export async function updateCoupangApiAction(prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "로그인이 필요합니다." };
    }

    const dto: UpdateCoupangApiDTO = {
      id: formData.get("id") as string,
      purpose: formData.get("purpose") as string || "OPEN API",
      businessId: formData.get("businessId") as string,
      vendorCode: formData.get("vendorCode") as string,
      accessKey: formData.get("accessKey") as string,
      secretKey: formData.get("secretKey") as string,
      expireDate: formData.get("expireDate") as string || null,
    };

    const repository = new SupabaseCoupangApiRepository();
    const useCase = new UpdateCoupangApiUseCase(repository);

    await useCase.execute(dto, user.id);
    revalidatePath("/settings");

    return { success: true, message: "수정되었습니다." };
  } catch (error: unknown) {
    console.error("UpdateCoupangApi error:", error);
    return { success: false, message: (error as Error).message || "수정되지 않았습니다." };
  }
}

export async function deleteCoupangApiAction(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "로그인이 필요합니다." };
    }

    const repository = new SupabaseCoupangApiRepository();
    const useCase = new DeleteCoupangApiUseCase(repository);

    await useCase.execute(id, user.id);
    revalidatePath("/settings");

    return { success: true, message: "삭제되었습니다." };
  } catch (error: unknown) {
    console.error("DeleteCoupangApi error:", error);
    return { success: false, message: (error as Error).message || "삭제되지 않았습니다." };
  }
}
