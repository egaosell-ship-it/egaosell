import { PageHeader } from "@/components/common/PageHeader";
import { TestClient } from "./_components/TestClient";

export default function TestPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="API 연동 테스트" 
        description="등록된 쿠팡 API(A00304065)를 사용하여 통신 테스트를 진행합니다." 
      />
      <TestClient />
    </div>
  );
}
