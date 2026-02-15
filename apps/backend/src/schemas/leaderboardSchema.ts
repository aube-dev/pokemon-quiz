export const leaderboardSchema = {
    tags: ['leaderboards'],
    description: '총점에 따른 상위 100명의 사용자 조회',
    security: [],
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: '사용자 ID' },
                    sn: { type: 'string', description: '군번' },
                    username: { type: 'string', nullable: true, description: '사용자 이름' },
                    totalScore: { type: 'number', description: '총점' },
                },
            },
        },
    },
}