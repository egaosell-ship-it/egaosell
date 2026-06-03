import Link from 'next/link';

export default function Header() {
  return (
    <nav className="bg-surface-container-lowest/80 backdrop-blur-md full-width top-0 sticky z-50 h-[64px] border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-md max-w-[1440px] mx-auto">
      <div className="flex items-center gap-lg">
        <Link href="/" className="text-headline-md font-headline-md font-bold text-primary cursor-pointer active:opacity-80 transition-opacity duration-150">
          egaoSell
        </Link>
        <div className="hidden md:flex gap-md">
          <Link href="#features" className="text-on-surface-variant font-medium text-label-md font-label-md hover:text-primary transition-colors duration-200">
            기능 소개
          </Link>
          <Link href="/pricing" className="text-on-surface-variant font-medium text-label-md font-label-md hover:text-primary transition-colors duration-200">
            요금제
          </Link>
          <Link href="/board" className="text-on-surface-variant font-medium text-label-md font-label-md hover:text-primary transition-colors duration-200">
            커뮤니티
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-sm">
        <Link href="/login" className="hidden md:block text-on-surface-variant font-medium text-label-md font-label-md hover:text-primary transition-colors duration-200 active:opacity-80">
          로그인
        </Link>
        <Link href="/login" className="bg-primary-container text-on-primary text-label-md font-label-md px-4 py-2 rounded active:scale-95 transition-transform duration-150 shadow-sm hover:opacity-90">
          무료 체험 시작
        </Link>
      </div>
    </nav>
  );
}
