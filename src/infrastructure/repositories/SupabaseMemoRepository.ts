import { IMemoRepository, CreateMemoDTO, UpdateMemoDTO } from "@/core/application/interfaces/IMemoRepository";
import { Memo } from "@/core/domain/entities/Memo";
import { createClient } from "@/infrastructure/config/supabase/server";

export class SupabaseMemoRepository implements IMemoRepository {
  async getMemosByUserId(userId: string): Promise<Memo[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("memos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`메모 목록 조회 중 오류가 발생했습니다: ${error.message}`);
    }

    return (data || []).map((row: any) =>
      Memo.create({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        content: row.content,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      })
    );
  }

  async createMemo(dto: CreateMemoDTO): Promise<Memo> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("memos")
      .insert({
        user_id: dto.userId,
        title: dto.title || "새 메모장",
        content: dto.content || "",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`메모 생성 중 오류가 발생했습니다: ${error.message}`);
    }

    return Memo.create({
      id: data.id,
      userId: data.user_id,
      title: data.title,
      content: data.content,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async updateMemo(dto: UpdateMemoDTO): Promise<Memo> {
    const supabase = await createClient();
    const updateData: any = { updated_at: new Date().toISOString() };
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.content !== undefined) updateData.content = dto.content;

    const { data, error } = await supabase
      .from("memos")
      .update(updateData)
      .eq("id", dto.id)
      .eq("user_id", dto.userId)
      .select()
      .single();

    if (error) {
      throw new Error(`메모 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }

    return Memo.create({
      id: data.id,
      userId: data.user_id,
      title: data.title,
      content: data.content,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  async deleteMemo(id: string, userId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("memos")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`메모 삭제 중 오류가 발생했습니다: ${error.message}`);
    }
  }
}
