import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant full-width py-xl mt-section">
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-md max-w-[1440px] mx-auto gap-lg">
        <div className="flex flex-col gap-sm">
          <span className="text-headline-sm font-headline-sm font-bold text-on-surface">egaoSell</span>
          <span className="text-body-sm font-body-sm text-on-surface-variant mt-2">© 2024 egaoSell Inc. All rights reserved.</span>
        </div>
        <div className="flex flex-col md:flex-row gap-lg">
          <Link href="#" className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            개인정보처리방침
          </Link>
          <Link href="#" className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            이용약관
          </Link>
          <Link href="#" className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            고객 문의
          </Link>
          <Link href="#" className="text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            사용 가이드
          </Link>
        </div>
      </div>
    </footer>
  );
}
