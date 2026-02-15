export const loginSchema = {
    tags: ['users'],
    description: '군번를 이용한 사용자 로그인 또는 등록',
    security: [],
    body: {
        type: 'object',
        required: ['sn'],
        properties: {
            sn: { type: 'string', description: '사용자 군번' },
            username: { type: 'string', description: '선택적 사용자 이름' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string', description: '사용자 ID' },
                sn: { type: 'string', description: '군번' },
                username: { type: 'string', nullable: true, description: '사용자 이름' },
                totalScore: { type: 'number', description: '총점' },
                createdAt: { type: 'string', format: 'date-time', description: '생성일' },
                updatedAt: { type: 'string', format: 'date-time', description: '수정일' },
            },
        },
    },
}

export const meSchema = {
    tags: ['users'],
    description: '현재 사용자 정보 조회 및 토큰 재발급',
    security: [{ bearerAuth: [] }],
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string', description: '사용자 ID' },
                sn: { type: 'string', description: '군번' },
                username: { type: 'string', nullable: true, description: '사용자 이름' },
                totalScore: { type: 'number', description: '총점' },
                createdAt: { type: 'string', format: 'date-time', description: '생성일' },
                updatedAt: { type: 'string', format: 'date-time', description: '수정일' },
                userProblems: {
                    type: 'array',
                    description: '사용자가 도전한 문제 목록',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: '도전 기록 ID' },
                            userId: { type: 'string', description: '사용자 ID' },
                            problemId: { type: 'string', description: '문제 ID' },
                            status: { type: 'string', enum: ['CHALLENGING', 'CORRECT', 'WRONG', 'GIVEN_UP'], description: '도전 상태' },
                            score: { type: 'number', description: '획득 점수' },
                            challengedAt: { type: 'string', format: 'date-time', nullable: true, description: '도전 시작 시각' },
                            submittedAt: { type: 'string', format: 'date-time', description: '제출 시각' },
                            problem: {
                                type: 'object',
                                description: '문제 정보',
                                properties: {
                                    id: { type: 'string', description: '문제 ID' },
                                    number: { type: 'number', description: '문제 번호' },
                                    title: { type: 'string', description: '문제 제목' },
                                    category: { type: 'string', description: '문제 카테고리' },
                                    score: { type: 'number', description: '문제 배점' },
                                },
                            },
                        },
                    },
                },
            },
        },
        401: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
        404: {
            type: 'object',
            properties: {
                error: { type: 'string' },
            },
        },
    },
}
