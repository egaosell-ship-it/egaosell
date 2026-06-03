import { createClient } from '@/infrastructure/config/supabase/server';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth.actions';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen p-8 bg-surface-container-lowest text-on-surface">
      <h1 className="text-display-lg font-bold text-primary mb-4">환영합니다!</h1>
      <p className="text-body-lg mb-8">로그인에 성공하셨습니다.</p>
      
      <div className="bg-surface-container-low p-6 rounded-lg mb-8">
        <h2 className="text-headline-sm font-semibold mb-2">내 프로필</h2>
        <p><strong>이메일:</strong> {user.email}</p>
        <p><strong>이름:</strong> {user.user_metadata?.name || '미설정'}</p>
        <p><strong>UID:</strong> {user.id}</p>
      </div>

      <form action={logoutAction}>
        <button type="submit" className="bg-error text-on-error px-4 py-2 rounded-lg font-medium hover:bg-error/90 transition-colors">
          로그아웃
        </button>
      </form>
    </div>
  );
}
