import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "nestjs-prisma";
import { Socket } from "socket.io";
import { ScanDto } from "src/events/dto/scan.dto";

@Injectable()
export class GatewaysGuard implements CanActivate {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) {

    }

    // this guard for verify the token , ip and status
    // and how to know the device has been registered in the database
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient<Socket>();
        const data = context.switchToWs().getData() as ScanDto;

        try {
            const token = await this.jwtService.verify(data.token, {
                ignoreExpiration: true
            })
            const gateway = await this.prismaService.gateways.findFirstOrThrow({
                where: {
                    token,
                    ip: data.ip,
                }
            })

            if (!gateway.status) {
                client.emit(`DEVICE_OFF_${data.ip}`)
                return false
            }
        } catch {
            client.emit(`UNAUTHENTICATION_ERROR_DEVICE_${data.ip}`, JSON.stringify({
                ip: data.ip
            }))
            return false;
        }

        return true

    }

}