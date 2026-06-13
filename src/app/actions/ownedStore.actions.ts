"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/infrastructure/config/supabase/server";
import { CreateOwnedStoreDTO, UpdateOwnedStoreDTO } from "@/core/application/dtos/OwnedStoreDTO";
import { SupabaseOwnedStoreRepository } from "@/infrastructure/repositories/SupabaseOwnedStoreRepository";
import { CreateOwnedStoreUseCase } from "@/core/application/use-cases/ownedStore/CreateOwnedStoreUseCase";
import { UpdateOwnedStoreUseCase } from "@/core/application/use-cases/ownedStore/UpdateOwnedStoreUseCase";
import { DeleteOwnedStoreUseCase } from "@/core/application/use-cases/ownedStore/DeleteOwnedStoreUseCase";

export async function createOwnedStoreAction(prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "로그인이 필요합니다." };
    }

    const dto: CreateOwnedStoreDTO = {
      businessId: formData.get("businessId") as string,
      platformName: formData.get("platformName") as string,
      loginId: formData.get("loginId") as string,
      siteName: formData.get("siteName") as string,
      storeUrl: formData.get("storeUrl") as string,
      invoicePromo1: formData.get("invoicePromo1") as string,
      invoicePromo2: formData.get("invoicePromo2") as string,
    };

    const repository = new SupabaseOwnedStoreRepository();
    const useCase = new CreateOwnedStoreUseCase(repository);

    await useCase.execute(dto, user.id);
    revalidatePath("/settings");

    return { success: true, message: "저장되었습니다." };
  } catch (error: unknown) {
    console.error("CreateOwnedStore error:", error);
    return { success: false, message: (error as Error).message || "저장되지 않았습니다." };
  }
}

export async function updateOwnedStoreAction(prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "로그인이 필요합니다." };
    }

    const dto: UpdateOwnedStoreDTO = {
      id: formData.get("id") as string,
      businessId: formData.get("businessId") as string,
      platformName: formData.get("platformName") as string,
      loginId: formData.get("loginId") as string,
      siteName: formData.get("siteName") as string,
      storeUrl: formData.get("storeUrl") as string,
      invoicePromo1: formData.get("invoicePromo1") as string,
      invoicePromo2: formData.get("invoicePromo2") as string,
    };

    const repository = new SupabaseOwnedStoreRepository();
    const useCase = new UpdateOwnedStoreUseCase(repository);

    await useCase.execute(dto, user.id);
    revalidatePath("/settings");

    return { success: true, message: "수정되었습니다." };
  } catch (error: unknown) {
    console.error("UpdateOwnedStore error:", error);
    return { success: false, message: (error as Error).message || "수정되지 않았습니다." };
  }
}

export async function deleteOwnedStoreAction(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "로그인이 필요합니다." };
    }

    const repository = new SupabaseOwnedStoreRepository();
    const useCase = new DeleteOwnedStoreUseCase(repository);

    await useCase.execute(id, user.id);
    revalidatePath("/settings");

    return { success: true, message: "삭제되었습니다." };
  } catch (error: unknown) {
    console.error("DeleteOwnedStore error:", error);
    return { success: false, message: (error as Error).message || "삭제되지 않았습니다." };
  }
}
