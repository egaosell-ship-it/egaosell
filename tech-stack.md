# 프로젝트 기술 스택 가이드라인

본 프로젝트는 Next.js(App Router)와 Supabase를 핵심 기술 스택으로 사용합니다. 각 기술 스택별 주요 운영 규칙을 아래에 정의합니다.

## 1. 프론트엔드 핵심: Next.js & React
* **App Router 기반 개발**: 기존 Pages Router 대신 `app/` 디렉토리 기반의 App Router 패러다임을 일관되게 따릅니다.
* **Server Components 기본화**: 렌더링 성능과 클라이언트 번들 사이즈 최소화를 위해 모든 컴포넌트는 기본적으로 서버 컴포넌트로 작성하며, 사용자 상호작용(onClick 등)이나 브라우저 API가 필요한 경우에 한해 부분적으로 `"use client"`를 선언합니다.

## 2. 백엔드 및 DB (BaaS): Supabase
* **Next.js 공식 통합 (`@supabase/ssr`)**: Next.js App Router 환경에서는 서버와 클라이언트 간의 안전한 쿠키 기반 인증을 위해 반드시 `@supabase/ssr` 패키지를 사용하여 연동합니다.
  * 서버 컴포넌트, 서버 액션, 라우트 핸들러 내부에서는 `createServerClient`를 사용합니다.
  * 클라이언트 컴포넌트 내부에서는 `createBrowserClient`를 사용합니다.
* **완벽한 타입 안정성 (Supabase Types)**: Supabase 데이터베이스 스키마 기반의 TypeScript 타입을 자동 생성(`types/supabase.ts`)하여 관리하고, 모든 DB 쿼리 객체에 해당 타입을 제네릭으로 주입하여 런타임 오류를 방지합니다.
* **RLS (Row Level Security) 필수 적용**: 보안 로직을 프론트엔드나 API 라우트에만 의존하지 않고, Supabase 내부의 테이블 RLS 정책을 설정하여 허가되지 않은 데이터 접근 및 수정을 데이터베이스 레벨에서 원천 차단합니다.

## 3. 스타일링: Tailwind CSS
* **Utility-First 원칙**: 별도의 커스텀 CSS 파일 작성을 최소화하고, Tailwind CSS의 유틸리티 클래스를 사용하여 직관적이고 일관된 디자인을 구현합니다.
* **동적 스타일링 주의사항**: Tailwind 클래스명을 문자열 보간법(String interpolation)으로 동적으로 생성하는 것을 지양하고(빌드 시 누락 발생), 동적 스타일 결합이 필요할 경우 `clsx`나 `tailwind-merge` 등의 유틸리티 라이브러리를 함께 활용합니다.

## 4. 언어: TypeScript
* **Strict 모드 준수**: `tsconfig.json`에서 `strict: true` 옵션을 유지하고 타입스크립트의 강력한 타입 체크 기능을 최대한 활용합니다.
* **`any` 타입 지양**: 컴파일러의 이점을 해치는 `any` 사용을 금지하며, 외부 데이터의 경우 정확한 인터페이스나 타입을 명시하여 데이터 무결성을 보장합니다.
