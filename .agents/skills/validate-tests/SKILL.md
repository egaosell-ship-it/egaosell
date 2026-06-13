---
name: validate-tests
description: 프로젝트 내에 작성된 테스트 코드들을 검증(Validate)할 때 사용하는 스킬입니다. TDD 사이클 및 클린 아키텍처 규칙이 잘 지켜졌는지 확인하고 커버리지를 점검합니다.
---

# Validate Tests Skill

이 스킬은 프로젝트에 작성된 테스트 코드들이 제대로 작동하는지, 그리고 프로젝트의 TDD 및 아키텍처 규칙을 잘 준수하고 있는지 검증할 때 사용합니다.

## 1. 사전 확인 (Prerequisites)
- `package.json`을 확인하여 `jest`, `vitest` 등의 테스트 프레임워크가 설치되어 있는지 확인합니다.
- `package.json`의 `scripts` 항목에 `test`나 `coverage` 명령어가 정의되어 있는지 확인합니다. 없는 경우 알맞은 명령어를 직접 실행해야 합니다 (예: `npx vitest run`).

## 2. 테스트 실행 및 결과 분석
- 전체 테스트 스위트를 실행합니다.
- 테스트가 모두 통과(Green)하는지 확인합니다.
- **실패 시(Red)**: 실패한 이유의 로그를 꼼꼼히 분석합니다. 비즈니스 로직의 결함인지, Mocking의 문제인지, 혹은 타입 에러인지 파악하고 수정 계획을 세웁니다.

## 3. 규칙 및 커버리지 검증 (Verification)
- **TDD 사이클 준수**: 코드를 먼저 작성하고 테스트를 끼워맞춘 형태가 아닌지 파악합니다.
- **계층형 테스트 전략**:
  - `Unit Tests`: Domain Entity와 Application Use Case를 올바르게 독립적으로(Mocking을 통해) 검증하고 있는지 확인합니다.
  - `Integration Tests`: Infrastructure 계층(예: DB Repository 연동)이 올바른지 검증합니다.
- **커버리지 달성도**: 전체 코드 커버리지가 **80% 이상**인지 확인하며, 특히 핵심 비즈니스 로직(Domain/UseCase)의 커버리지가 높은지 체크합니다.

## 4. 후속 조치 (Action & Report)
- 발견된 에러가 있다면 즉시 수정하고 다시 테스트를 실행하여 통과시킵니다.
- 검증 결과를 사용자에게 요약하여 보고합니다 (성공한 테스트 수, 실패한 테스트 수, 커버리지 결과 등).
