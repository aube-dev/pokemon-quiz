# 🎮 포동포동 퀴즈 백엔드 (Podong Podong Quiz Backend)

포켓몬 퀴즈 서비스를 위한 고성능 API 서버입니다. Fastify와 Prisma를 기반으로 구축되었으며, Supabase PostgreSQL을 데이터베이스로 사용합니다.

## 🔍 기술 스택

- **Framework:** [Fastify](https://fastify.dev/) (高 성능 Node.js 프레임워크)
- **ORM:** [Prisma](https://www.prisma.io/) (타입 안전한 데이터베이스 액세스)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Language:** TypeScript
- **Auth:** JWT (JSON Web Token) + HTTP-Only Cookie
- **Documentation:** [Scalar](https://scalar.com/) (OpenAPI/Swagger)

## ✨ 주요 기능

- **실시간 랭킹 시스템:** 사용자별 총점을 기반으로 한 실시간 리더보드
- **다양한 퀴즈 콘텐츠 지원:** 텍스트, 이미지, 유튜브, 오디오 등 멀티미디어 퀴즈 지원
- **안전한 인증:** 시리얼 번호(SN) 기반의 간편 로그인 및 JWT 보안 인증
- **도전 관리:** 문제별 도전 상태(도전 중, 정답, 오답, 포기) 관리 및 중복 참여 방지
- **자동 문서화:** Scalar를 통한 인터랙티브 API 문서 제공

## 📁 프로젝트 구조

```text
apps/backend/
├── src/
│   ├── app.ts                 # Fastify 앱 설정 및 플러그인 등록
│   ├── server.ts              # 서버 엔트리 포인트
│   ├── constants.ts           # 공통 상수 정의
│   ├── plugins/               # Fastify 커스텀 플러그인 (Prisma, JWT 등)
│   ├── routes/                # API 엔드포인트 정의 (라우터)
│   ├── services/              # 비즈니스 로직 처리 (Service Layer)
│   ├── schemas/               # JSON Schema (검증 및 Swagger용)
│   └── types/                 # 전역 타입 정의
├── prisma/
│   └── schema.prisma          # 데이터베이스 스키마 정의
└── .env                       # 환경 변수 설정
```

## 🏃 빠른 시작

1. **의존성 설치:** `pnpm install`
2. **환경 변수 설정:** `.env.example`을 복사하여 `.env`를 생성하고 필요한 키들을 입력합니다.
3. **Prisma 클라이언트 생성:** `pnpm db:generate`
4. **개발 서버 실행:** `pnpm dev`
5. **API 문서 확인:** 서버 실행 후 `http://localhost:3000/docs` 접속

자세한 설정 방법은 [QUICKSTART.md](./QUICKSTART.md)를 참고하세요.

## 🔌 API 엔드포인트 요약

| 분류 | 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- | :--- |
| **사용자** | `POST` | `/api/users/login` | SN 기반 로그인 및 자동 가입 |
| | `GET` | `/api/users/me` | 현재 로그인한 사용자 정보 및 토큰 갱신 |
| | `GET` | `/api/users/leaderboard` | 전체 랭킹 조회 |
| **문제** | `GET` | `/api/problems` | 모든 문제 목록 조회 (요약) |
| | `GET` | `/api/problems/:id` | 특정 문제의 상세 정보 조회 |
| | `PATCH` | `/api/problems/number/:number/challenge` | 문제 도전 시작 (UUID 반환) |
| | `POST` | `/api/problems/:id/submit` | 문제 정답 제출 및 결과 반영 |
| | `PATCH` | `/api/problems/:id/giveup` | 문제 도전 포기 처리 |

## 🛠 개발 명령어

- `pnpm dev`: 개발 모드로 서버 실행 (Hot Reload)
- `pnpm build`: TypeScript 코드를 JavaScript로 컴파일
- `pnpm start`: 빌드된 결과물로 서버 실행
- `pnpm db:generate`: Prisma Client 생성
- `pnpm db:push`: DB 스키마 업데이트 (개발용)
- `pnpm db:studio`: 데이터베이스 GUI 실행

## 📝 라이선스

MIT
