import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient
    }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
    // Create connection pool for Prisma adapter
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL!,
    })

    const adapter = new PrismaPg(pool)

    const prisma = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    })

    await prisma.$connect()

    server.decorate('prisma', prisma)

    server.addHook('onClose', async (instance) => {
        await instance.prisma.$disconnect()
        await pool.end()
    })
})

export default prismaPlugin
