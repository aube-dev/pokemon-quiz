import { FastifyPluginAsync } from 'fastify'
import { LeaderboardService } from '../services/leaderboardService'
import { leaderboardSchema } from '../schemas/leaderboardSchema'

const leaderboardRoutes: FastifyPluginAsync = async (server) => {
    const leaderboardService = new LeaderboardService(server)

    server.get('/leaderboard', {
        schema: leaderboardSchema,
    }, async (_, reply) => {
        const leaderboard = await leaderboardService.getLeaderboard()
        return reply.send(leaderboard)
    })
}

export default leaderboardRoutes
