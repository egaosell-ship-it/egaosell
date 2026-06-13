import { Button } from '@/components/common/Button';

export default function PlatformMarginTab() {
  // Mock Data
  const mockPlatforms = [
    {
      id: 1,
      companyName: '(주)이가오셀',
      platform: '쿠팡',
      commission: '10.5%',
      shippingFee: '3,000원',
      otherCosts: '0원',
    },
    {
      id: 2,
      companyName: '(주)이가오셀',
      platform: '네이버 스마트스토어',
      commission: '5.8%',
      shippingFee: '3,000원',
      otherCosts: '100원',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-on-surface">플랫폼마진세팅</h2>
        <Button icon="add">새플랫폼</Button>
      </div>

      <div className="overflow-x-auto border border-outline-variant rounded-md">
        <table className="w-full text-sm text-left text-on-surface">
          <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">번호</th>
              <th className="px-4 py-3 whitespace-nowrap">상호</th>
              <th className="px-4 py-3 whitespace-nowrap">플랫폼</th>
              <th className="px-4 py-3 whitespace-nowrap">수수료</th>
              <th className="px-4 py-3 whitespace-nowrap">배송비</th>
              <th className="px-4 py-3 whitespace-nowrap">기타비용</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {mockPlatforms.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant">
                  등록된 플랫폼 마진 세팅이 없습니다.
                </td>
              </tr>
            ) : (
              mockPlatforms.map((plat, index) => (
                <tr key={plat.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{plat.companyName}</td>
                  <td className="px-4 py-3">{plat.platform}</td>
                  <td className="px-4 py-3">{plat.commission}</td>
                  <td className="px-4 py-3">{plat.shippingFee}</td>
                  <td className="px-4 py-3">{plat.otherCosts}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-primary hover:text-primary-fixed-variant text-xs font-medium mr-2">수정</button>
                    <button className="text-error hover:text-error/80 text-xs font-medium">삭제</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
