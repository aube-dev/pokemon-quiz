import Fastify, { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifyScalar from '@scalar/fastify-api-reference'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import prismaPlugin from './plugins/prisma'
import supabasePlugin from './plugins/supabase'
import jwtPlugin from './plugins/jwt'
import eventGatePlugin from './plugins/event-gate'
import userRoutes from './routes/users'
import problemRoutes from './routes/problems'
import leaderboardRoutes from './routes/leaderboard'
import eventRoutes from './routes/event'

export async function buildApp(): Promise<FastifyInstance> {
    const app = Fastify({
        logger: process.env.NODE_ENV === 'development' ? {
            level: 'debug',
            transport: {
                target: 'pino-pretty',
                options: {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                    colorize: true,
                },
            },
        } : true,
    })

    // 글로벌 에러 핸들러
    app.setErrorHandler((error, _, reply) => {
        if (error.statusCode === 400) {
            return reply.status(400).send({
                error: error.message
            })
        }

        if (error.statusCode === 401) {
            return reply.status(401).send({
                error: '인증에 실패했습니다. 다시 로그인해주세요.',
            })
        }

        app.log.error(error)
        reply.status(error.statusCode || 500).send({
            error: error.message
        })
    })

    // Swagger 설정 (OpenAPI 문서 생성)
    await app.register(fastifySwagger, {
        openapi: {
            info: {
                title: '포동포동 퀴즈 API',
                description: '포동포동 퀴즈를 위한 API 문서',
                version: '1.0.0',
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: '개발 서버',
                },
            ],
            tags: [
                { name: 'users', description: '사용자 관련 엔드포인트' },
                { name: 'problems', description: '문제 관련 엔드포인트' },
                { name: 'leaderboards', description: '리더보드 관련 엔드포인트' },
                { name: 'health', description: '헬스 체크 엔드포인트' },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
        },
    })

    // Scalar API Reference UI 설정
    await app.register(fastifyScalar, {
        routePrefix: '/docs',
        configuration: {
            theme: 'purple',
            darkMode: true,
        },
    })

    // CORS 설정
    await app.register(fastifyCors, {
        origin: [
            'http://localhost:3000',           // 로컬 개발 환경
            'https://pokemon-quiz-frontend.vercel.app' // Vercel 배포 환경
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });

    // Cookie 설정
    await app.register(fastifyCookie, {
        secret: process.env.COOKIE_SECRET || 'cookie-secret',
    })

    // 플러그인 등록
    await app.register(prismaPlugin)
    await app.register(supabasePlugin)
    await app.register(jwtPlugin)
    await app.register(eventGatePlugin)

    // 라우트 등록
    await app.register(userRoutes, { prefix: '/api' })
    await app.register(problemRoutes, { prefix: '/api' })
    await app.register(leaderboardRoutes, { prefix: '/api' })
    await app.register(eventRoutes, { prefix: '/api' })

    // Health check
    app.get('/health', {
        schema: {
            tags: ['health'],
            description: '헬스 체크 엔드포인트',
            security: [],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        timestamp: { type: 'string' },
                    },
                },
            },
        },
    }, async () => {
        return { status: 'ok', timestamp: new Date().toISOString() }
    })

    return app
}
