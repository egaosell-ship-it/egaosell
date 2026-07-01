'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Panel } from '@/components/common/Panel';
import { testNaverApiAction } from '@/app/actions/testNaver.actions';

export function TestNaverClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestClick = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await testNaverApiAction();
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
            <h2 className="text-title-md font-bold text-on-surface">네이버 커머스 API 테스트</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              DB에서 애플리케이션 시크릿 "Qfnt57DVAJSsHrgrY35sH" 인 API 키를 불러와 인증 토큰 발급 및 데이터 조회를 테스트합니다.
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
              <pre className="bg-surface-container-lowest p-4 rounded-md overflow-auto text-xs text-on-surface-variant max-h-[500px] border border-outline-variant whitespace-pre-wrap break-all">
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
