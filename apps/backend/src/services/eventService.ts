import { PrismaClient } from '@prisma/client';

export class EventService {
    constructor(private prisma: PrismaClient) { }

    async getEventConfig() {
        let config = await this.prisma.eventConfig.findFirst();

        // If no config exists, create a default one based on the hardcoded values
        if (!config) {
            config = await this.prisma.eventConfig.create({
                data: {
                    eventStartTime: new Date('2026-02-17T19:00:00+09:00'),
                    eventEndTime: new Date('2026-02-17T20:00:00+09:00'),
                }
            });
        }

        return config;
    }
}
