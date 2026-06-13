---
name: validate-og-meta
description: 프로젝트 내 페이지들의 OG(Open Graph) 메타태그 및 SEO 설정 현황을 점검하고, 독립적인 메타데이터 설정이 필요한 주요 페이지를 찾아 적절한 메타데이터를 추천하는 스킬입니다.
---

# Validate OG Meta Tags Skill

이 스킬은 프로젝트 내 Next.js App Router의 Metadata API 설정 상태를 검증하고, SEO 및 소셜 공유(Open Graph) 기능 강화를 위해 메타데이터 추가가 필요한 동적/정적 페이지를 발굴하여 추천할 때 사용합니다.

## 1. 전역 메타데이터 점검 (Root Layout)
- `src/app/layout.tsx` 파일 내에 `metadataBase`, `openGraph`, `twitter` 설정이 전역으로 잘 정의되어 있는지 점검합니다.
- OG 이미지 경로(`images`), `type`, `locale`, `siteName` 등의 필수 속성이 누락되지 않았는지 확인합니다.

## 2. 독립적인 메타데이터 적용 대상 페이지 탐색
- 프로젝트의 라우팅 구조(`src/app` 하위 폴더)를 분석하여 **각 페이지별 특화된 메타데이터가 필요한 곳**을 찾습니다.
- **주요 탐색 대상**:
  - `[id]` 형태의 동적 라우트 (예: 특정 상품 상세 페이지, 게시판 글 등)
  - 주요 랜딩 페이지 (`/landing`, `/pricing` 등)
  - 마케팅 및 전환(Conversion)에 중요한 페이지 (`/checkout`, `/upgrade` 등)
- 해당 페이지들에 개별 `export const metadata: Metadata` (정적) 또는 `export async function generateMetadata()` (동적)가 선언되어 있는지 확인합니다.

## 3. 메타데이터 분석 및 추천 (Recommendation)
독립적인 메타데이터 설정이 누락되어 전역 설정을 그대로 상속받고 있는 페이지를 발견한 경우, 다음과 같은 기준으로 메타데이터를 추천합니다.

- **정적 라우트 (Static Pages)**:
  해당 페이지의 기능과 목적을 명확히 설명하는 `title`과 `description`을 추천합니다.
  *(예시: 로그인 페이지라면 `title: "로그인 | egaoSell"`)*
- **동적 라우트 (Dynamic Pages)**:
  `generateMetadata` 함수를 사용하여 DB의 실제 데이터를 바탕으로 동적인 `title`, `description`, `images`를 설정하는 코드를 제안합니다.
  *(예시: 상품 상세 페이지라면 API/DB에서 조회한 "상품명"과 "상품 썸네일 이미지"를 OG 태그로 주입하는 코드)*

## 4. 리포팅 포맷 (Reporting)
검증 및 탐색이 끝나면 아래와 같은 형태로 분석 결과를 제공합니다:
1. **전역 설정 점검 결과**: `layout.tsx` 기준 보완 사항
2. **독립 메타데이터가 필요한 페이지 목록**: 탐색된 경로와 누락 사유
3. **코드 추천**: 각 페이지의 상황에 맞게 바로 적용 가능한 `metadata` 객체 또는 `generateMetadata` 코드 스니펫 제시
