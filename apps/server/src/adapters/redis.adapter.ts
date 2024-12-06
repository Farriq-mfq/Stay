import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';

import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class RedisIoAdapter extends IoAdapter {
    protected redisAdapter;

    constructor(app: INestApplication) {
        super(app);
        const configService = app.get(ConfigService);

        const pubClient = createClient({
            url: configService.get("REDIS_URL")
        });
        const subClient = pubClient.duplicate();

        pubClient.connect();
        subClient.connect();

        this.redisAdapter = createAdapter(pubClient, subClient);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const server = super.createIOServer(port, options) as Server;

        server.adapter(this.redisAdapter);

        return server;
    }
}