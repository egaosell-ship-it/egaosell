import { PageHeader } from "@/components/common/PageHeader";
import { TestNaverClient } from "./_components/TestNaverClient";

export default function TestNaverPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="네이버 커머스 API 연동 테스트" 
        description="등록된 네이버 커머스 API를 사용하여 토큰 발급 및 통신 테스트를 진행합니다." 
      />
      <TestNaverClient />
    </div>
  );
}
