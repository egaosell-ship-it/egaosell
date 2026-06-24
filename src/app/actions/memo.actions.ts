"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/infrastructure/config/supabase/server";
import { SupabaseMemoRepository } from "@/infrastructure/repositories/SupabaseMemoRepository";
import { GetMemosUseCase } from "@/core/application/use-cases/memo/GetMemosUseCase";
import { CreateMemoUseCase } from "@/core/application/use-cases/memo/CreateMemoUseCase";
import { UpdateMemoUseCase } from "@/core/application/use-cases/memo/UpdateMemoUseCase";
import { DeleteMemoUseCase } from "@/core/application/use-cases/memo/DeleteMemoUseCase";

// Composition Root: 인프라 의존성 주입
const memoRepository = new SupabaseMemoRepository();
const getMemosUseCase = new GetMemosUseCase(memoRepository);
const createMemoUseCase = new CreateMemoUseCase(memoRepository);
const updateMemoUseCase = new UpdateMemoUseCase(memoRepository);
const deleteMemoUseCase = new DeleteMemoUseCase(memoRepository);

// 인증 유틸리티
async function getUserId(): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    throw new Error("로그인이 필요합니다.");
  }
  return data.user.id;
}

export async function getMemosAction() {
  try {
    const userId = await getUserId();
    const memos = await getMemosUseCase.execute(userId);
    // 도메인 엔티티를 직렬화 가능한 형태로 변환하여 반환
    return {
      success: true,
      data: memos.map(m => ({
        id: m.id,
        title: m.title,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createMemoAction(title?: string, content?: string) {
  try {
    const userId = await getUserId();
    const memo = await createMemoUseCase.execute({ userId, title, content });
    revalidatePath("/(dashboard)");
    return {
      success: true,
      data: {
        id: memo.id,
        title: memo.title,
        content: memo.content,
        createdAt: memo.createdAt.toISOString(),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateMemoAction(id: string, title?: string, content?: string) {
  try {
    const userId = await getUserId();
    const memo = await updateMemoUseCase.execute({ id, userId, title, content });
    revalidatePath("/(dashboard)");
    return {
      success: true,
      data: {
        id: memo.id,
        title: memo.title,
        content: memo.content,
        createdAt: memo.createdAt.toISOString(),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMemoAction(id: string) {
  try {
    const userId = await getUserId();
    await deleteMemoUseCase.execute(id, userId);
    revalidatePath("/(dashboard)");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
