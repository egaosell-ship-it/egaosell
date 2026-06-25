"use server";

import { revalidatePath } from "next/cache";
import { CreateSupplierProductsUseCase } from "@/core/application/use-cases/product/CreateSupplierProductsUseCase";
import { GetSupplierProductsUseCase } from "@/core/application/use-cases/product/GetSupplierProductsUseCase";
import { DeleteAllSupplierProductsUseCase } from "@/core/application/use-cases/product/DeleteAllSupplierProductsUseCase";
import { UpdateSupplierProductUseCase } from "@/core/application/use-cases/product/UpdateSupplierProductUseCase";
import { SupabaseSupplierProductRepository } from "@/infrastructure/repositories/SupabaseSupplierProductRepository";
import { SupplierProductProps } from "@/core/domain/entities/SupplierProduct";

// 1. Repository 구현체 생성
const repository = new SupabaseSupplierProductRepository();

// 2. Use Cases 생성 (의존성 주입)
const createSupplierProductsUseCase = new CreateSupplierProductsUseCase(repository);
const getSupplierProductsUseCase = new GetSupplierProductsUseCase(repository);
const deleteAllSupplierProductsUseCase = new DeleteAllSupplierProductsUseCase(repository);
const updateSupplierProductUseCase = new UpdateSupplierProductUseCase(repository);

export async function uploadSupplierProductsAction(products: SupplierProductProps[], businessId?: string) {
  try {
    // 상품마다 비즈니스 ID 부여
    const productsWithBusinessId = products.map(p => ({
      ...p,
      business_id: businessId || null
    }));

    await createSupplierProductsUseCase.execute(productsWithBusinessId);
    
    // 업로드 후 상품 목록 페이지 갱신
    revalidatePath("/products");
    
    return { success: true };
  } catch (error: any) {
    console.error("uploadSupplierProductsAction error:", error);
    return { success: false, error: error.message || "상품 업로드 중 오류가 발생했습니다." };
  }
}

export async function getSupplierProductsAction(limit?: number, businessId?: string | null) {
  try {
    // 순환 참조 및 직렬화 문제 방지를 위해 toJSON 호출
    const products = await repository.findAll({ limit, businessId });
    return { success: true, data: products.map(p => p.toJSON()) };
  } catch (error: any) {
    console.error("getSupplierProductsAction error:", error);
    return { success: false, error: error.message || "상품 목록 조회 중 오류가 발생했습니다.", data: [] };
  }
}

export async function deleteSupplierProductAction(id: string) {
  try {
    await repository.delete(id);
    revalidatePath("/products");
    return { success: true };
  } catch (error: any) {
    console.error("deleteSupplierProductAction error:", error);
    return { success: false, error: error.message || "상품 삭제 중 오류가 발생했습니다." };
  }
}

export async function deleteAllSupplierProductsAction(businessId?: string | null) {
  try {
    await repository.deleteAll(businessId);
    revalidatePath("/products");
    return { success: true };
  } catch (error: any) {
    console.error("deleteAllSupplierProductsAction error:", error);
    return { success: false, error: error.message || "전체 상품 삭제 중 오류가 발생했습니다." };
  }
}

export async function checkDuplicateSupplierProductsAction(naverProductIds: string[]) {
  try {
    const duplicates = await repository.findDuplicatesByNaverIds(naverProductIds);
    return { success: true, duplicates };
  } catch (error: any) {
    console.error("checkDuplicateSupplierProductsAction error:", error);
    return { success: false, error: error.message || "중복 검사 중 오류가 발생했습니다.", duplicates: [] };
  }
}

export async function updateSupplierProductAction(id: string, data: Partial<SupplierProductProps>) {
  try {
    await updateSupplierProductUseCase.execute(id, data);
    revalidatePath("/products");
    return { success: true };
  } catch (error: any) {
    console.error("updateSupplierProductAction error:", error);
    return { success: false, error: error.message || "상품 수정 중 오류가 발생했습니다." };
  }
}
