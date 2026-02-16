import createError from '@fastify/error'

const ERROR_MESSAGES = {
    INVALID_REQUEST: '잘못된 요청입니다.',
    UNAUTHORIZED: '인증에 실패했습니다. 다시 로그인해주세요.',
    INTERNAL_SERVER_ERROR: '서버 내부 에러가 발생했습니다.',
    FORBIDDEN_GIVEN_UP: '접근이 거부되었습니다. 이미 이 문제를 포기하셨습니다.',
    PROBLEM_NOT_FOUND: '문제를 찾을 수 없습니다.',
    USER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
    ALREADY_ATTEMPTED: '이미 이 문제를 시작했거나 완료했습니다.',
    CHALLENGE_REQUIRED: '먼저 도전을 시작해야 합니다.',
    CHALLENGE_ENDED: '이 문제는 이미 완료되었거나 포기한 상태입니다.',
    EVENT_NOT_OPEN: '이벤트 기간이 아닙니다. 정해진 시간에 참여 가능합니다.',
};

export const AlreadyAttempted = createError('ALREADY_ATTEMPTED', ERROR_MESSAGES.ALREADY_ATTEMPTED, 400)
export const ChallengeRequired = createError('CHALLENGE_REQUIRED', ERROR_MESSAGES.CHALLENGE_REQUIRED, 400)
export const ChallengeEnded = createError('CHALLENGE_ENDED', ERROR_MESSAGES.CHALLENGE_ENDED, 400)
export const EventNotOpen = createError('EVENT_NOT_OPEN', ERROR_MESSAGES.EVENT_NOT_OPEN, 400)
export const ForbiddenGivenUp = createError('FORBIDDEN_GIVEN_UP', ERROR_MESSAGES.FORBIDDEN_GIVEN_UP, 403)
export const ProblemNotFound = createError('PROBLEM_NOT_FOUND', ERROR_MESSAGES.PROBLEM_NOT_FOUND, 404)
export const UserNotFound = createError('USER_NOT_FOUND', ERROR_MESSAGES.USER_NOT_FOUND, 404)
export const InvalidRequest = createError('INVALID_REQUEST', ERROR_MESSAGES.INVALID_REQUEST, 400)
export const Unauthorized = createError('UNAUTHORIZED', ERROR_MESSAGES.UNAUTHORIZED, 401)
export const InternalServerError = createError('INTERNAL_SERVER_ERROR', ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500)
