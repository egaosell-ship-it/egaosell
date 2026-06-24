import { Memo } from "@/core/domain/entities/Memo";

export interface CreateMemoDTO {
  userId: string;
  title?: string;
  content?: string;
}

export interface UpdateMemoDTO {
  id: string;
  userId: string;
  title?: string;
  content?: string;
}

export interface IMemoRepository {
  getMemosByUserId(userId: string): Promise<Memo[]>;
  createMemo(dto: CreateMemoDTO): Promise<Memo>;
  updateMemo(dto: UpdateMemoDTO): Promise<Memo>;
  deleteMemo(id: string, userId: string): Promise<void>;
}
