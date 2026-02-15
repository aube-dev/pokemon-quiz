# 🚀 빠른 시작 가이드 (Quick Start Guide)

이 문서는 개발 환경을 빠르게 설정하고 로컬에서 서버를 실행하는 방법을 안내합니다.

## 1. 전제 조건

- [Node.js](https://nodejs.org/) (v24 이상 권장)
- [pnpm](https://pnpm.io/) (패키지 매니저)
- [Supabase](https://supabase.com/) 계정 및 프로젝트

## 2. 로컬 설정 단계

### 1) 저장소 클론 및 패키지 설치
```bash
git clone <repository-url>
cd pokemon-quiz/apps/backend
pnpm install
```

### 2) 환경 변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성합니다.
```bash
cp .env.example .env
```
`.env` 파일에 다음 정보를 입력합니다:
- `DATABASE_URL`: Supabase의 Transaction connection pooler URL (Port 6543)
- `DIRECT_URL`: Supabase의 Direct connection URL (Port 5432)
- `JWT_SECRET`: JWT 서명에 사용할 임의의 문자열
- `COOKIE_SECRET`: 쿠키 암호화에 사용할 임의의 문자열

### 3) 데이터베이스 준비
Prisma를 사용하여 데이터베이스와 동기화하고 클라이언트를 생성합니다.
```bash
pnpm db:generate
# 처음 시작하거나 스키마가 변경된 경우
pnpm db:push
```

### 4) 서버 실행
```bash
pnpm dev
```
서버가 실행되면 `http://localhost:3000`에서 요청을 받을 준비가 됩니다.

## 3. 작동 확인 (Test)

### Health Check
```bash
curl http://localhost:3000/health
```
정상 작동 시 `{"status":"ok", ...}` 응답이 옵니다.

### API 문서 확인
웹 브라우저에서 아래 주소로 접속하여 대화형 API 문서를 확인하세요.
- URL: `http://localhost:3000/docs`

## 4. 프론트엔드 연결 팁

- API Base URL: `http://localhost:3000/api`
- 인증 방식: 
  - `POST /api/users/login` 호출 시 `token` 쿠키가 설정됩니다.
  - 다음 요청부터는 쿠키가 자동으로 포함되도록 `withCredentials: true` (axios) 또는 `credentials: 'include'` (fetch) 설정을 확인하세요.
  - 또는 헤더에 `Authorization: Bearer <token>`을 포함하여 요청할 수도 있습니다.

---
궁금한 점은 [README.md](./README.md)를 확인하거나 개발팀에 문의하세요.
