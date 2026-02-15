import { FastifyPluginAsync } from 'fastify'
import { UserService } from '../services/userService'
import { UserLoginDto } from '../types/quiz'
import { COOKIE_MAX_AGE } from '../constants'
import { loginSchema, leaderboardSchema, meSchema } from '../schemas/userSchema'

const userRoutes: FastifyPluginAsync = async (server) => {
    const userService = new UserService(server)

    // 첫 로그인 시 사용자 생성 (sn으로 식별)
    server.post<{
        Body: UserLoginDto
    }>('/users/login', {
        schema: loginSchema,
    }, async (request, reply) => {
        const user = await userService.login(request.body)

        // JWT 발급
        const token = server.jwt.sign({ id: user.id, sn: user.sn })

        // 쿠키 설정
        reply.setCookie('token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: COOKIE_MAX_AGE,
        })

        return reply.send(user)
    })

    // 리더보드 조회 (점수 순위)
    server.get('/users/leaderboard', {
        onRequest: [server.authenticate],
        schema: leaderboardSchema,
    }, async (request, reply) => {
        const users = await userService.getLeaderboard()
        return reply.send(users)
    })

    // 내 정보 조회 (+ 토큰 재발급)
    server.get('/users/me', {
        onRequest: [server.authenticate],
        schema: meSchema,
    }, async (request, reply) => {
        const { id } = request.user
        const user = await userService.getUserInfo(id)

        if (!user) {
            return reply.status(404).send({ error: '사용자를 찾을 수 없습니다.' })
        }

        // 토큰 재발급
        const token = server.jwt.sign({ id: user.id, sn: user.sn })

        // 쿠키 설정
        reply.setCookie('token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: COOKIE_MAX_AGE,
        })

        return reply.send(user)
    })
}

export default userRoutes
