import { FastifyInstance } from 'fastify'
import { UserLoginDto } from '@pokemon-quiz/interface'

export class UserService {
    constructor(private server: FastifyInstance) { }

    async login(dto: UserLoginDto) {
        const { sn, username } = dto
        let user = await this.server.prisma.user.findUnique({
            where: { sn },
        })

        if (!user) {
            user = await this.server.prisma.user.create({
                data: {
                    sn,
                    username,
                },
            })
        }

        return user
    }

    async getLeaderboard(limit: number = 100) {
        return this.server.prisma.user.findMany({
            orderBy: {
                totalScore: 'desc',
            },
            take: limit,
            select: {
                id: true,
                sn: true,
                username: true,
                totalScore: true,
            },
        })
    }

    async getUserInfo(id: string) {
        return this.server.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                sn: true,
                username: true,
                totalScore: true,
                createdAt: true,
                updatedAt: true,
                userProblems: {
                    select: {
                        status: true,
                        score: true,
                        challengedAt: true,
                        submittedAt: true,
                        problem: {
                            select: {
                                number: true,
                            }
                        }
                    },
                },
            },
        })
    }
}
