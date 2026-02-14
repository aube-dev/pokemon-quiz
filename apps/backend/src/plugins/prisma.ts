import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import { FastifyPluginAsync } from 'fastify'

// Use declaration merging to add types to the Fastify instance
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient
    }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
    const prisma = new PrismaClient({
        log: ['error', 'warn'],
    })

    await prisma.$connect()

    // Make prisma available on the fastify instance
    server.decorate('prisma', prisma)

    server.addHook('onClose', async (server) => {
        await server.prisma.$disconnect()
    })
})

export default prismaPlugin
