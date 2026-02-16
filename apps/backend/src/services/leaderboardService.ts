import { FastifyInstance } from 'fastify'

export class LeaderboardService {
    constructor(private server: FastifyInstance) { }

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
}
