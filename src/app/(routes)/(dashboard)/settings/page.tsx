import Link from 'next/link';
import BusinessInfoTab from './_components/BusinessInfoTab';
import BrandListTab from './_components/BrandListTab';
import PlatformMarginTab from './_components/PlatformMarginTab';

interface SettingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.tab || 'business';

  const tabs = [
    { id: 'business', name: '사업자정보관리' },
    { id: 'brands', name: '브랜드리스트' },
    { id: 'margins', name: '플랫폼마진세팅' },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 w-full max-w-7xl mx-auto h-full overflow-hidden">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
          <span className="text-[24px]">⚙️</span>
          설정
        </h1>
        <p className="text-sm text-on-surface-variant">계정 설정 및 비즈니스 관련 정보를 관리합니다.</p>
      </div>

      <div className="flex border-b border-outline-variant mb-6">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/settings?tab=${tab.id}`}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                isActive
                  ? 'border-primary text-primary-fixed-variant'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
        {currentTab === 'business' && <BusinessInfoTab />}
        {currentTab === 'brands' && <BrandListTab />}
        {currentTab === 'margins' && <PlatformMarginTab />}
      </div>
    </div>
  );
}
