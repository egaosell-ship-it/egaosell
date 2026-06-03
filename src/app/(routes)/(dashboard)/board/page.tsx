import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";

export default function BoardPage() {
  return (
    <>
      <PageHeader 
        title="커뮤니티 게시판" 
        description="셀러 노하우 및 정보를 공유하는 공간입니다." 
      />
      
      <div className="mt-6 flex flex-col gap-4">
        <Panel>
          <p className="text-sm text-on-surface">준비 중인 페이지입니다.</p>
        </Panel>
      </div>
    </>
  );
}
