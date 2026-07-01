'use server';

import { createClient } from '@/infrastructure/config/supabase/server';
import { CoupangApiService } from '@/infrastructure/services/CoupangApiService';

export async function testCoupangApiAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized: No user logged in' };
    }

    // vendor_code가 'A00304065'인 coupang API 정보 조회
    const { data: coupangApi, error } = await supabase
      .from('coupang_apis')
      .select('*')
      .eq('user_id', user.id)
      .eq('vendor_code', 'A00304065')
      .single();

    if (error || !coupangApi) {
      return { 
        success: false, 
        error: `Database Error: Could not find Coupang API credentials for vendor 'A00304065'. (${error?.message || 'Not found'})` 
      };
    }

    // 서비스 클래스를 통한 API 호출
    const coupangService = new CoupangApiService(
      coupangApi.vendor_code,
      coupangApi.access_key,
      coupangApi.secret_key
    );

    const apiResult = await coupangService.getSellerProducts();

    return {
      success: apiResult.success,
      status: apiResult.status,
      data: apiResult.data,
      error: apiResult.error
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Server Error: ${error.message}`
    };
  }
}
