'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Panel } from '@/components/common/Panel';
import { testCoupangApiAction } from '@/app/actions/test.actions';

export function TestClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestClick = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await testCoupangApiAction();
      setResult(response);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel className="p-6 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4">
          <div>
            <h2 className="text-title-md font-bold text-on-surface">쿠팡 WING API 테스트</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              DB에서 Vendor Code "A00304065" 인 Access/Secret Key를 불러와 상품 목록 API를 호출합니다.
            </p>
          </div>
          <Button 
            onClick={handleTestClick} 
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? '테스트 중...' : 'API 테스트 실행'}
          </Button>
        </div>

        <div className="bg-surface-container rounded-md p-4 min-h-[300px]">
          {result ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">상태:</span>
                {result.success ? (
                  <span className="text-primary font-bold text-sm">성공 (200)</span>
                ) : (
                  <span className="text-error font-bold text-sm">실패 ({result.status || '에러'})</span>
                )}
              </div>

              {result.error && (
                <div className="bg-error/10 text-error p-3 rounded-md text-sm">
                  {result.error}
                </div>
              )}

              <div className="text-sm font-bold mt-2">API 응답 데이터:</div>
              <pre className="bg-surface-container-lowest p-4 rounded-md overflow-auto text-xs text-on-surface-variant max-h-[500px] border border-outline-variant">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-secondary text-sm">
              우측 상단의 "API 테스트 실행" 버튼을 클릭하세요.
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
