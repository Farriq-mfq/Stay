import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsExceptionFilter {
    public catch(exception: HttpException, host: ArgumentsHost) {
        const client = host.switchToWs().getClient();
        this.handleError(client, exception);
    }

    public handleError(client: Socket, exception: HttpException | WsException) {
        if (exception instanceof HttpException) {
            const response = {
                statusCode: 400,
                message: 'Validation failed',
                errors: exception,
            };
            client.send(JSON.stringify(response));
        } else {
            const response = {
                statusCode: 500,
                message: 'Internal server error',
                errors: exception,
            };
            client.send(JSON.stringify(response));
        }
    }
}