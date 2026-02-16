import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { EventNotOpen } from '../errors';

const eventGate: FastifyPluginAsync = async (fastify) => {
    fastify.addHook('onRequest', async (request, reply) => {
        // Skip checks for specific routes
        if (
            request.url.startsWith('/health') ||
            request.url.startsWith('/docs') ||
            request.url.startsWith('/api/users/login') ||
            request.url.startsWith('/api/users/me') ||
            request.url.startsWith('/api/leaderboard') ||
            request.url.startsWith('/api/event/config')
        ) {
            return;
        }

        let config = await fastify.prisma.eventConfig.findFirst();

        if (!config) {
            return;
        }

        const now = new Date();
        const startTime = new Date(config.eventStartTime);
        const endTime = new Date(config.eventEndTime);

        if (now < startTime || now > endTime) {
            return reply.status(503).send(new EventNotOpen({
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
            }));
        }
    });
};

export default fp(eventGate);
