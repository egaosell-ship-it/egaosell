import { NextResponse } from 'next/server';
import { executeDailyBillingPayments } from '@/app/actions/billing.actions';

export async function GET(request: Request) {
  // Vercel Cron Job 보안 인증 (CRON_SECRET 확인)
  // Vercel 배포 시 자동으로 생성되거나 직접 설정한 CRON_SECRET 환경변수를 검증합니다.
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await executeDailyBillingPayments();
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
