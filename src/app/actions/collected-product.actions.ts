'use server';

import { SupabaseCollectedProductRepository } from '@/infrastructure/repositories/SupabaseCollectedProductRepository';
import { GetCollectedProductsUseCase } from '@/core/application/use-cases/collected-product/GetCollectedProductsUseCase';
import { DeleteCollectedProductUseCase } from '@/core/application/use-cases/collected-product/DeleteCollectedProductUseCase';
import { UpdateCollectedProductUseCase, UpdateCollectedProductDTO } from '@/core/application/use-cases/collected-product/UpdateCollectedProductUseCase';
import { createClient } from '@/infrastructure/config/supabase/server';
import { revalidatePath } from 'next/cache';

// Composition Root
const getRepository = () => new SupabaseCollectedProductRepository();

export async function getCollectedProductsAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }

    const useCase = new GetCollectedProductsUseCase(getRepository());
    const products = await useCase.execute(user.id);
    
    return { success: true, data: products };
  } catch (error: any) {
    console.error('getCollectedProductsAction Error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCollectedProductAction(dto: UpdateCollectedProductDTO) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }

    const useCase = new UpdateCollectedProductUseCase(getRepository());
    await useCase.execute(dto);
    
    revalidatePath('/collected-products');
    return { success: true };
  } catch (error: any) {
    console.error('updateCollectedProductAction Error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCollectedProductAction(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: '인증되지 않은 사용자입니다.' };
    }

    const useCase = new DeleteCollectedProductUseCase(getRepository());
    await useCase.execute(id);
    
    revalidatePath('/collected-products');
    return { success: true };
  } catch (error: any) {
    console.error('deleteCollectedProductAction Error:', error);
    return { success: false, error: error.message };
  }
}
