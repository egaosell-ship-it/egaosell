'use server';

import { createClient } from '@/infrastructure/config/supabase/server';
import { NaverApiService } from '@/infrastructure/services/NaverApiService';

export async function testNaverApiAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized: No user logged in' };
    }

    // 사용자 요청 조건: app_id가 'Qfnt57DVAJSsHrgrY35sH' 인 데이터 조회
    const { data: naverApi, error } = await supabase
      .from('naver_apis')
      .select('*')
      .eq('user_id', user.id)
      .eq('app_id', 'Qfnt57DVAJSsHrgrY35sH')
      .limit(1)
      .single();

    if (error || !naverApi) {
      return { 
        success: false, 
        error: `Database Error: Could not find Naver API credentials for the Application ID 'Qfnt57DVAJSsHrgrY35sH'. (${error?.message || 'Not found'})` 
      };
    }

    // 서비스 클래스를 통한 API 호출
    const naverService = new NaverApiService(
      naverApi.app_id,
      naverApi.app_secret
    );

    const apiResult = await naverService.getOriginProductsTest();

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
