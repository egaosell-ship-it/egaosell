import { PlatformMargin } from "@/core/domain/entities/PlatformMargin";

export interface IPlatformMarginRepository {
  create(margin: PlatformMargin): Promise<void>;
  findByUserId(userId: string): Promise<PlatformMargin[]>;
  update(margin: PlatformMargin): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}
