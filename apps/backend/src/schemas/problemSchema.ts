const blockItems = {
    type: 'object',
    required: ['type'],
    oneOf: [
        {
            properties: { type: { const: 'text' }, content: { type: 'string', description: '텍스트 내용' } },
            required: ['content']
        },
        {
            properties: { type: { const: 'image' }, imageUrl: { type: 'string', description: '이미지 URL' } },
            required: ['imageUrl']
        },
        {
            properties: { type: { const: 'youtube' }, embedUrl: { type: 'string', description: '유튜브 임베드 URL' } },
            required: ['embedUrl']
        },
        {
            properties: { type: { const: 'audio' }, audioUrl: { type: 'string', description: '오디오 URL' } },
            required: ['audioUrl']
        }
    ]
}

export const getAllProblemsSchema = {
    tags: ['problems'],
    description: '모든 이용 가능한 문제 조회',
    security: [{ bearerAuth: [] }],
    querystring: {
        type: 'object',
        properties: {
            sortBy: {
                type: 'string',
                enum: ['number', 'score'],
                default: 'number',
                description: '정렬 기준 (number: 번호순, score: 배점순)'
            },
            sortOrder: {
                type: 'string',
                enum: ['asc', 'desc'],
                default: 'asc',
                description: '정렬 방향 (asc: 오름차순, desc: 내림차순)'
            }
        }
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    number: { type: 'number', description: '문제 번호' },
                    title: { type: 'string', description: '문제 제목' },
                    tag: { type: 'string', description: '문제 태그/카테고리' },
                    score: { type: 'number', description: '문제 점수' },
                },
            },
        },
    },
}

export const getProblemByIdSchema = {
    tags: ['problems'],
    description: 'ID로 특정 문제 조회. 사용자가 이 문제를 포기한 경우 접근이 거부됩니다.',
    security: [{ bearerAuth: [] }],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', description: '문제 ID' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string', description: '문제 ID' },
                number: { type: 'number', description: '문제 번호' },
                title: { type: 'string', description: '문제 제목' },
                category: { type: 'string', description: '문제 카테고리' },
                score: { type: 'number', description: '문제 점수' },
                content: {
                    type: 'array',
                    description: '문제 콘텐츠 (이미지, 텍스트, 유튜브, 오디오 등)',
                    items: blockItems
                },
                answer: {
                    type: 'object',
                    description: '보기 및 정답 정보',
                    properties: {
                        options: {
                            type: 'array',
                            description: '보기 목록 (4개)',
                            items: {
                                type: 'object',
                                properties: {
                                    number: { type: 'number', description: '보기 번호 (1~4)' },
                                    blocks: {
                                        type: 'array',
                                        description: '보기 콘텐츠 구성 요소',
                                        items: blockItems
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
        403: {
            type: 'object',
            properties: {
                error: { type: 'string', description: '에러 메시지' },
                code: { type: 'string', description: '에러 코드' },
            },
        },
        404: {
            type: 'object',
            properties: {
                error: { type: 'string', description: '에러 메시지' },
            },
        },
    },
}

export const createProblemSchema = {
    tags: ['problems'],
    description: '새로운 문제 생성',
    security: [{ bearerAuth: [] }],
    body: {
        type: 'object',
        required: ['title', 'category', 'content', 'answer'],
        properties: {
            title: { type: 'string', description: '문제 제목' },
            category: { type: 'string', description: '문제 카테고리' },
            content: {
                type: 'array',
                description: '문제 콘텐츠 구성 요소를 담은 배열',
                items: blockItems
            },
            answer: {
                type: 'object',
                description: '보기 및 정답 정보',
                required: ['options', 'correct'],
                properties: {
                    options: {
                        type: 'array',
                        description: '보기 목록 (4개)',
                        minItems: 4,
                        maxItems: 4,
                        items: {
                            type: 'object',
                            required: ['number', 'blocks'],
                            properties: {
                                number: { type: 'number', description: '보기 번호 (1~4)' },
                                blocks: {
                                    type: 'array',
                                    description: '보기 콘텐츠 구성 요소',
                                    items: blockItems
                                }
                            }
                        }
                    },
                    correct: { type: 'number', description: '정답 보기 번호 (1~4)' }
                }
            }
        },
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string', description: '생성된 문제 ID' },
                number: { type: 'number', description: '생성된 문제 번호' },
                title: { type: 'string', description: '문제 제목' },
                category: { type: 'string', description: '문제 카테고리' },
            },
        },
    },
}

export const startChallengeSchema = {
    tags: ['problems'],
    description: '문제 번호로 도전 시작 (성공 시 문제 UUID 반환)',
    security: [{ bearerAuth: [] }],
    params: {
        type: 'object',
        properties: {
            number: { type: 'number', description: '문제 번호' }
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                problemId: { type: 'string', description: '문제 UUID (이후 조회/제출에 사용)' },
                status: { type: 'string', description: '상태 (CHALLENGING)' },
                challengedAt: { type: 'string', format: 'date-time', description: '도전 시작 시각' },
            },
        },
        400: {
            type: 'object',
            properties: {
                error: { type: 'string', description: '에러 메시지' },
            },
        },
    },
}

export const submitAnswerSchema = {
    tags: ['problems'],
    description: '문제 정답 결과 제출 및 점수 반영',
    security: [{ bearerAuth: [] }],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', description: '문제 ID' }
        }
    },
    body: {
        type: 'object',
        required: ['choice'],
        properties: {
            choice: { type: 'number', description: '사용자가 선택한 번호 (1~4)' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string', description: '도전 기록 ID' },
                status: { type: 'string', description: '상태 (CORRECT 또는 WRONG)' },
                score: { type: 'number', description: '획득한 점수' },
                submittedAt: { type: 'string', format: 'date-time', description: '제출 시각' },
                isCorrect: { type: 'boolean', description: '정답 여부' },
            },
        },
        400: {
            type: 'object',
            properties: {
                error: { type: 'string', description: '에러 메시지' },
            },
        },
    },
}

export const giveUpSchema = {
    tags: ['problems'],
    description: '문제 도전 포기 (포기 시 재참여 불가)',
    security: [{ bearerAuth: [] }],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string', description: '문제 ID' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string', description: '도전 기록 ID' },
                status: { type: 'string', description: '상태 (GIVEN_UP)' },
            },
        },
        400: {
            type: 'object',
            properties: {
                error: { type: 'string', description: '에러 메시지' },
            },
        },
    },
}
