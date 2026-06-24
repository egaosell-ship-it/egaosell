"use server";

import { revalidatePath } from "next/cache";
import { CreateSupplierProductsUseCase } from "@/core/application/use-cases/product/CreateSupplierProductsUseCase";
import { GetSupplierProductsUseCase } from "@/core/application/use-cases/product/GetSupplierProductsUseCase";
import { SupabaseSupplierProductRepository } from "@/infrastructure/repositories/SupabaseSupplierProductRepository";
import { SupplierProductProps } from "@/core/domain/entities/SupplierProduct";

// Composition Root
const repository = new SupabaseSupplierProductRepository();
const createSupplierProductsUseCase = new CreateSupplierProductsUseCase(repository);
const getSupplierProductsUseCase = new GetSupplierProductsUseCase(repository);

export async function uploadSupplierProductsAction(products: SupplierProductProps[]) {
  try {
    await createSupplierProductsUseCase.execute(products);
    
    // 업로드 후 상품 목록 페이지 갱신
    revalidatePath("/products");
    
    return { success: true };
  } catch (error: any) {
    console.error("uploadSupplierProductsAction error:", error);
    return { success: false, error: error.message || "상품 업로드 중 오류가 발생했습니다." };
  }
}

export async function getSupplierProductsAction(limit?: number) {
  try {
    // 순환 참조 및 직렬화 문제 방지를 위해 toJSON 호출
    const products = await repository.findAll({ limit });
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
