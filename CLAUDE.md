# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

LettersTo는 편지 교환 서비스를 제공하는 React Native 모바일 애플리케이션(iOS/Android)입니다. React Native 0.70 기반으로 구축되었으며, React Navigation(라우팅), Zustand(상태 관리), React Query(서버 상태 관리)를 사용합니다.

## 환경 요구사항

- Node.js: v16.13.1
- Ruby: 2.7.5 (중요 - 반드시 버전 일치 필요)
- Watchman: 2-22.09.19.00
- Xcode: 14.0 (14A309)
- CocoaPods: 1.11.3
- React Native: 0.70

## 개발 명령어

### 설치
```bash
npm install
cd ios && pod install && cd ..
```

### 앱 실행
```bash
npm start                # Metro 번들러 시작
npm run ios             # iOS 시뮬레이터에서 실행
npm run android         # Android 에뮬레이터에서 실행
```

### 코드 품질
```bash
npm run lint            # ESLint 실행
npm test                # Jest 테스트 실행
```

## 아키텍처

### 경로 별칭 (Path Aliases)
`tsconfig.json`과 `babel.config.js`에 설정된 경로 별칭을 사용합니다:

- `@screens/*` → `src/Screens/*`
- `@components/*` → `src/Components/*`
- `@hooks/*` → `src/Hooks/*`
- `@stores/*` → `src/Store/*`
- `@type/*` → `src/types/*`
- `@utils/*` → `src/Utils/*`
- `@constants/*` → `src/Constants/*`
- `@assets/*` → `src/Assets/*`
- `@apis/*` → `src/APIs/*`
- `~/*` → `src/*`

상대 경로 대신 항상 이 경로 별칭을 사용해야 합니다.

### 애플리케이션 진입점

`App.tsx`는 루트 컴포넌트로 다음을 수행합니다:
- React Query 클라이언트 초기화 (전역 에러 처리로 토스트 표시)
- 딥링크 설정 (`letterstoapp://` 프리픽스로 알림, 편지함 상세, 주소 관리 연결)
- 토스트 지원을 위한 `RootSiblingParent` 래핑
- `useAnalytics` 훅으로 Firebase Analytics 통합

### 네비게이션 구조

`src/Navigator.tsx`는 인증 상태에 따라 조건부 렌더링하는 메인 스택 네비게이터를 포함합니다:
- **isLoading**: 스플래시 화면 표시
- **isLoggedIn**: 인증된 화면 표시 (Main, LetterEditor, MyPage 등)
- **로그인 안됨**: Auth 플로우 표시 (Auth → NicknameForm → TopicsForm → PersonalityForm → LocationForm → Coachmark)

딥링크 설정:
- `notifications` → Notifications 화면
- `letterbox/:id/:fromMemberId` → LetterBoxDetail 화면
- `address_manage` → AddressManage 화면

### 상태 관리

**Zustand 스토어** (`src/Store/`):
- `auth.ts`: 인증 상태, 사용자 정보, 회원가입 플로우
  - 로그인/로그아웃, JWT 토큰 관리 (AsyncStorage에 저장)
  - 다단계 회원가입: registerToken → nickname → topics → personalities → geolocation
  - `loginWithExistTokens()`로 저장된 토큰으로 자동 로그인

- `feedback.ts`: UI 피드백 상태
- `store.ts`: 기타 전역 상태

스토어 액션은 `useAuthAction()` 같은 커스텀 훅으로 접근합니다.

### API 레이어

`src/Utils/http.ts`의 axios 인스턴스:
- AsyncStorage에서 JWT 토큰 자동 주입
- 401 에러 시 토큰 갱신 (새 토큰으로 한 번 자동 재시도)
- PATCH 요청 커스텀 처리 (데이터를 쿼리 파라미터로 직렬화)
- 응답 자동 언래핑 (`res.data`)
- 환경 기반 base URL (`__DEV__`로 테스트/프로덕션 전환)

`src/APIs/`의 API 모듈들은 이 인스턴스를 사용하며 타입이 지정된 응답을 반환합니다.

### 화면 구성

`src/Screens/`는 기능별로 구성됩니다:
- `Auth/`: 로그인 및 회원가입 플로우
- `Letter/`: 편지 보기, 편집, 표지 커스터마이징
- `Main/`: 하단 탭이 있는 메인 앱 인터페이스
- `MyPage/`: 사용자 프로필 및 설정
- `Notifications/`: 푸시 알림 관리
- `Stamp/`: 우표 수집 및 보상
- `LetterBox/`: 받은/보낸 편지함
- `Coachmark/`: 온보딩 튜토리얼

### 컴포넌트

`src/Components/`는 기능별로 구성된 재사용 가능한 UI 컴포넌트를 포함합니다:
- `Auth/`: 인증 관련 버튼 및 텍스트
- `Button/`: 다양한 버튼 타입 (Header, Bottom, Gradient 등)
- `Headers/`: 다양한 화면 타입용 헤더 컴포넌트
- `LetterEditor/`: 편지 작성 UI (종이 스타일, 텍스티콘, 우표)
- `Modals/`: 알림, 확인, 기능별 모달
- `MyPage/`: 프로필 및 설정 컴포넌트
- `Notification/`: 알림 목록 아이템 및 컨트롤
- `Stamp/`: 우표 표시 및 보상 UI

### 커스텀 훅

`src/Hooks/`는 카테고리별로 구성됩니다:
- `Analytics/`: Firebase Analytics 통합
- `Hardware/`: 제스처 및 키보드 처리
- `UserInfo/`: 위치, 성격, 주제, 닉네임 관리
- `useInterval.ts`: 커스텀 인터벌 훅
- `useAppState.ts`: 앱 포그라운드/백그라운드 상태 리스너

### 유틸리티

`src/Utils/`:
- `http.ts`: 인증 및 에러 처리가 포함된 Axios 인스턴스
- `dateFormatter.ts`: 날짜 포맷팅 유틸리티
- `deeplink.ts`: 딥링크 헬퍼
- `hyperlink.ts`: 하이퍼링크 텍스트 파싱
- `image.ts`: 이미지 처리 유틸리티

### 푸시 알림

앱은 FCM(Firebase Cloud Messaging)과 APNS(Apple Push Notification Service)를 모두 사용합니다:
- `src/APIs/push.ts`를 통한 토큰 등록
- `App.tsx`에서 알림 탭으로부터의 딥링크 처리
- 알림 화면에서 알림 설정 관리
- 로컬 알림을 위해 `@notifee/react-native` 사용
- 푸시 처리를 위해 `react-native-push-notification` 사용

### 서드파티 통합

- **Firebase**: Analytics, App Distribution, Messaging
- **소셜 로그인**: 카카오 로그인, Apple 인증
- **광고**: Google Mobile Ads
- **공유**: 카카오 공유하기
- **이미지 선택**: Expo Image Picker
- **저장소**: 데이터 지속성을 위한 AsyncStorage

## 코드 스타일

- `@react-native-community` 설정의 ESLint 사용
- 일부 규칙에 대해 TypeScript strict 모드 비활성화 (`.eslintrc.js` 참조)
- 인라인 스타일 허용 (`react-native/no-inline-styles: off`)
- 한 줄 구문에 대한 중괄호 강제 안 함
