import { FastifyInstance } from 'fastify';
import { EventService } from '../services/eventService';

export default async function eventRoutes(app: FastifyInstance) {
    const eventService = new EventService(app.prisma);

    app.get('/event/config', {
        schema: {
            tags: ['event'],
            description: '이벤트 설정 정보(시작/종료 시간)를 조회합니다.',
            response: {
                200: {
                    type: 'object',
                    properties: {
                        eventStartTime: { type: 'string' },
                        eventEndTime: { type: 'string' },
                    }
                }
            }
        }
    }, async () => {
        const config = await eventService.getEventConfig();
        return config;
    });
}
