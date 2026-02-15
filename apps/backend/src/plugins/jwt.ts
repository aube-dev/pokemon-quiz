import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fp from 'fastify-plugin'

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    }
    interface FastifyRequest {
        user: { id: string; sn: string }
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { id: string; sn: string }
        user: { id: string; sn: string }
    }
}

export default fp(async (fastify: FastifyInstance) => {
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'jwt-secret',
        cookie: {
            cookieName: 'token',
            signed: false,
        },
    })

    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify()
        } catch (err) {
            reply.status(401).send({ error: '인증에 실패했습니다. 다시 로그인해주세요.' })
        }
    })
})
