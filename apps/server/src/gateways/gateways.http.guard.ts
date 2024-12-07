import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { PrismaService } from "nestjs-prisma";
import { ScanDto } from "src/events/dto/scan.dto";

@Injectable()
export class GatewaysHttpGuard implements CanActivate {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) {

    }

    // this guard for verify the token , ip and status
    // and how to know the device has been registered in the database
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest() as Request;
        const data = req.body as ScanDto
        Logger.debug(data);
        try {
            const gateway = await this.prismaService.gateways.findFirstOrThrow({
                where: {
                    token: data.token,
                    ip: data.ip,
                }
            })

            if (!gateway.status) {
                return false
            }
        } catch {
            return false;
        }

        return true

    }

}