export const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day

export const ERROR_MESSAGES = {
    INVALID_REQUEST: '잘못된 요청입니다.',
    UNAUTHORIZED: '인증에 실패했습니다. 다시 로그인해주세요.',
    INTERNAL_SERVER_ERROR: '서버 내부 에러가 발생했습니다.',
    FORBIDDEN_GIVEN_UP: '접근이 거부되었습니다. 이미 이 문제를 포기하셨습니다.',
    PROBLEM_NOT_FOUND: '문제를 찾을 수 없습니다.',
    USER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
    ALREADY_ATTEMPTED: '이미 이 문제를 시작했거나 완료했습니다.',
    CHALLENGE_REQUIRED: '먼저 도전을 시작해야 합니다.',
    CHALLENGE_ENDED: '이 문제는 이미 완료되었거나 포기한 상태입니다.',
};

export const ERROR_CODES = {
    PROBLEM_GIVEN_UP: 'PROBLEM_GIVEN_UP',
};
