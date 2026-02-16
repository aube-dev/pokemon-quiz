import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ERROR_MESSAGES } from '../constants';

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

        // Fetch config from DB
        let config = await fastify.prisma.eventConfig.findFirst();

        // Default if not found (should be initialized by service but being safe)
        if (!config) {
            return; // Or block? If no config, maybe allow? Let's be strict.
        }

        const now = new Date();
        const startTime = new Date(config.eventStartTime);
        const endTime = new Date(config.eventEndTime);

        if (now < startTime || now > endTime) {
            return reply.status(503).send({
                error: 'Service Unavailable',
                message: ERROR_MESSAGES.EVENT_NOT_OPEN,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
            });
        }
    });
};

export default fp(eventGate);
