import { CanActivate, ExecutionContext, Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CustomPrismaService } from "nestjs-prisma";
import { GROUP_KEY } from "src/decorators/group.decorator";
import { ExtendedPrismaClient } from "src/prisma.extension";

@Injectable()
export class PegawaiGroupGuard implements CanActivate {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredGroups = this.reflector.getAllAndOverride<string[]>(GROUP_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (!requiredGroups) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) return false;

        const pegawai = await this.prismaService.client.pegawai.findUnique({
            where: {
                id: parseInt(user.sub),
            },
        });

        if (!pegawai) return false;

        if (!requiredGroups.includes(pegawai.group)) throw new ServiceUnavailableException()
        return true
    }

}