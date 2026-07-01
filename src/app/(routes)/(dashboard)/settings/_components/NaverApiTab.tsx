import { Button } from "@/components/common/Button";

export default async function NaverApiTab() {
  // TODO: 나중에 DB에서 Naver API 연동 정보를 불러오는 로직 추가
  const apis: any[] = []; 

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-on-surface">네이버api</h2>
        
        {/* 모달 껍데기로 대체될 임시 API정보입력 버튼 */}
        <Button variant="primary">
          API정보입력
        </Button>
      </div>

      <div className="overflow-x-auto border border-outline-variant rounded-md">
        <table className="w-full text-sm text-left text-on-surface">
          <thead className="text-xs text-on-surface-variant uppercase bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">번호</th>
              <th className="px-4 py-3 whitespace-nowrap">종류</th>
              <th className="px-4 py-3 whitespace-nowrap">사업자명</th>
              <th className="px-4 py-3 whitespace-nowrap">애플리케이션 ID</th>
              <th className="px-4 py-3 whitespace-nowrap">애플리케이션 시크릿</th>
              <th className="px-4 py-3 whitespace-nowrap">API호출 IP</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {apis.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant">
                  등록된 네이버 API 정보가 없습니다.
                </td>
              </tr>
            ) : (
              apis.map((api, index) => (
                <tr key={index} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{api.type || "-"}</td>
                  <td className="px-4 py-3 font-medium">{api.companyName || "-"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{api.appId || "-"}</td>
                  <td className="px-4 py-3 font-mono text-xs">••••••••</td>
                  <td className="px-4 py-3">{api.ip || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-primary hover:underline text-xs">수정</button>
                      <span className="text-outline-variant">|</span>
                      <button className="text-error hover:underline text-xs">삭제</button>
                    </div>
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
