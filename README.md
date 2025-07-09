# KotlinBack Frontend

React + TypeScript + Zustand + React Query로 구축된 프론트엔드 애플리케이션입니다.

## 기술 스택

- **언어**: TypeScript
- **프레임워크**: React 18
- **상태 관리**: Zustand
- **서버 상태 관리**: React Query (TanStack Query)
- **라우팅**: React Router DOM
- **HTTP 클라이언트**: Axios
- **스타일링**: Tailwind CSS
- **빌드 도구**: Create React App

## 주요 기능

- ✅ JWT 기반 인증 (로그인/회원가입)
- ✅ 사용자 CRUD (생성, 조회, 수정, 삭제)
- ✅ 프로필 관리
- ✅ **실시간 채팅 시스템**
  - 채팅방 생성 및 관리
  - 실시간 메시지 송수신
  - 메시지 수정/삭제
  - 방 참여/나가기
- ✅ 반응형 UI (Tailwind CSS)
- ✅ 상태 관리 (Zustand)
- ✅ 서버 상태 관리 (React Query)
- ✅ 라우트 보호 (인증 필요/불필요)

## 프로젝트 구조

```
src/
├── api/                    # API 관련
│   ├── axios.ts           # Axios 인스턴스 및 인터셉터
│   ├── auth.ts            # 인증 API
│   ├── user.ts            # 사용자 API
│   └── chat.ts            # 채팅 API
├── components/            # 컴포넌트
│   ├── Layout.tsx         # 레이아웃 컴포넌트
│   ├── auth/              # 인증 관련 컴포넌트
│   │   ├── LoginForm.tsx  # 로그인 폼
│   │   └── RegisterForm.tsx # 회원가입 폼
│   └── chat/              # 채팅 관련 컴포넌트
│       ├── ChatRoomList.tsx # 채팅방 목록
│       └── ChatRoom.tsx   # 채팅방
├── hooks/                 # 커스텀 훅
│   ├── useAuth.ts         # 인증 관련 훅
│   └── useUser.ts         # 사용자 관련 훅
├── pages/                 # 페이지 컴포넌트
│   ├── Home.tsx           # 홈 페이지
│   ├── Users.tsx          # 사용자 목록 페이지
│   ├── Profile.tsx        # 프로필 페이지
│   └── Chat.tsx           # 채팅 페이지
├── store/                 # 상태 관리
│   └── authStore.ts       # 인증 상태 관리 (Zustand)
├── types/                 # TypeScript 타입 정의
│   └── index.ts           # 공통 타입
└── App.tsx                # 메인 앱 컴포넌트
```

## 채팅 기능

### 채팅 API 엔드포인트

- `POST /chat/rooms` - 채팅방 생성
- `GET /chat/rooms` - 채팅방 목록 조회
- `GET /chat/rooms/{roomId}` - 방 상세 정보 조회
- `POST /chat/rooms/{roomId}/join` - 방 참여
- `POST /chat/rooms/{roomId}/leave` - 방 나가기
- `GET /chat/rooms/{roomId}/messages` - 방의 메시지 조회
- `POST /chat/rooms/{roomId}/messages` - 메시지 전송
- `PUT /chat/messages/{messageId}` - 메시지 수정
- `DELETE /chat/messages/{messageId}` - 메시지 삭제

### 채팅 기능 특징

- **실시간 메시지**: 3초마다 자동 새로고침
- **메시지 관리**: 본인 메시지 수정/삭제 가능
- **방 관리**: 방 생성, 참여, 나가기
- **UI/UX**: 
  - 본인 메시지는 오른쪽, 다른 사람 메시지는 왼쪽 정렬
  - 메시지 수정/삭제 버튼은 호버 시 표시
  - 수정된 메시지 표시
  - 자동 스크롤 (새 메시지)
  - 반응형 디자인

### 데이터베이스 스키마

채팅 기능은 다음 테이블들을 사용합니다:

- `rooms`: 채팅방 정보
- `messages`: 메시지 정보
- `room_participants`: 방 참여자
- `room_admins`: 방 관리자

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm start
```

애플리케이션이 http://localhost:3000 에서 실행됩니다.

### 3. 빌드

```bash
npm run build
```

## 환경 변수

`.env` 파일을 생성하여 다음 환경 변수를 설정할 수 있습니다:

```env
REACT_APP_API_URL=http://localhost:8080
```

## API 연동

이 프론트엔드는 KotlinBack 백엔드 API와 연동됩니다:

- **인증**: JWT 토큰 기반
- **API 엔드포인트**: `/auth/*`, `/users/*`, `/chat/*`
- **에러 처리**: Axios 인터셉터를 통한 자동 처리

## 주요 라이브러리

- **Zustand**: 클라이언트 상태 관리
- **React Query**: 서버 상태 관리 및 캐싱
- **Axios**: HTTP 클라이언트
- **React Router**: 클라이언트 사이드 라우팅
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크

## 개발 도구

- **React Query DevTools**: 서버 상태 디버깅
- **TypeScript**: 타입 안전성
- **ESLint**: 코드 품질 관리
