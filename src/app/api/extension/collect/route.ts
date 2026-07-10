import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 이 API는 외부 익스텐션에서 호출하므로 CORS 허용 처리가 필요할 수 있습니다.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: '인증 토큰이 제공되지 않았습니다.' }, { status: 401, headers: corsHeaders });
    }

    const token = authHeader.split(' ')[1];

    // 서비스 키(Admin) 권한으로 Supabase 클라이언트 생성하여 토큰 검증
    // 클라이언트 인증을 수행하기 위해 토큰을 검증해야 함
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ success: false, error: '유효하지 않거나 만료된 토큰입니다.' }, { status: 401, headers: corsHeaders });
    }

    // Body 파싱
    const productData = await req.json();

    if (!productData || !productData.productName) {
      return NextResponse.json({ success: false, error: '상품 정보가 누락되었습니다.' }, { status: 400, headers: corsHeaders });
    }

    // DB 저장 (예시: supplier_products 테이블에 저장)
    // 크롤링된 상품을 담을 특정 테이블이나 구조에 맞춰야 하나, 여기서는 supplier_products에 삽입 시도
    // 사용자의 실제 DB 구조에 맞게 커스텀 가능
    const { error: insertError } = await supabase
      .from('product_collected')
      .insert([
        {
          user_id: user.id,
          platform: productData.platform || 'Unknown',
          product_id: productData.productId || null,
          product_name: productData.productName,
          price: productData.price,
          image_url: productData.imageUrl || null,
          detail_images: productData.detailImages || [],
          description: productData.description || null,
          reviews: productData.reviews || []
        }
      ]);

    if (insertError) {
      // supplier_products 스키마 불일치로 실패할 수 있으므로 콘솔에 로깅
      console.error("DB Insert Error:", insertError);
      return NextResponse.json({ success: false, error: '데이터베이스 저장 실패', details: insertError }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, message: '상품 수집이 완료되었습니다.' }, { status: 200, headers: corsHeaders });

  } catch (error: any) {
    console.error("Extension API Error:", error);
    return NextResponse.json({ success: false, error: '서버 에러가 발생했습니다.' }, { status: 500, headers: corsHeaders });
  }
}
