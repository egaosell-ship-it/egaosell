import { ICollectedProductRepository } from '../../core/application/interfaces/ICollectedProductRepository';
import { CollectedProduct } from '../../core/domain/entities/CollectedProduct';
import { createClient } from '../config/supabase/server';

export class SupabaseCollectedProductRepository implements ICollectedProductRepository {
  async getCollectedProducts(userId: string): Promise<CollectedProduct[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('product_collected')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch collected products: ${error.message}`);
    }

    return (data || []).map(row => CollectedProduct.create({
      id: row.id,
      userId: row.user_id,
      platform: row.platform,
      productId: row.product_id,
      productName: row.product_name,
      price: row.price,
      imageUrl: row.image_url,
      detailImages: row.detail_images || [],
      description: row.description,
      reviews: row.reviews || [],
      createdAt: row.created_at
    }));
  }

  async getCollectedProductById(id: string): Promise<CollectedProduct | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('product_collected')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // NotFound
      throw new Error(`Failed to fetch collected product by id: ${error.message}`);
    }

    if (!data) return null;

    return CollectedProduct.create({
      id: data.id,
      userId: data.user_id,
      platform: data.platform,
      productId: data.product_id,
      productName: data.product_name,
      price: data.price,
      imageUrl: data.image_url,
      detailImages: data.detail_images || [],
      description: data.description,
      reviews: data.reviews || [],
      createdAt: data.created_at
    });
  }

  async updateCollectedProduct(product: CollectedProduct): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('product_collected')
      .update({
        product_name: product.productName,
        price: product.price
      })
      .eq('id', product.id);

    if (error) {
      throw new Error(`Failed to update collected product: ${error.message}`);
    }
  }

  async deleteCollectedProduct(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('product_collected')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete collected product: ${error.message}`);
    }
  }
}
