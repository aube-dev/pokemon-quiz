import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', async function (request, reply) {
        return { status: 'ok', message: 'Pokemon Quiz Backend API' }
    })
}

export default root;
