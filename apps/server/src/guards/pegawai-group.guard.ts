import { CanActivate, ExecutionContext, Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { isJSON } from "class-validator";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";
import { isArray } from "src/utils/helpers";

@Injectable()
export class PegawaiGroupGuard implements CanActivate {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const featureName = this.reflector.getAllAndMerge('feature', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!featureName || isArray(featureName)) return true


        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) return false;

        const pegawai = await this.prismaService.client.pegawai.findUnique({
            where: {
                id: parseInt(user.sub),
            },
            select: {
                group: true
            }
        });

        if (!pegawai) return false;

        const feature = await this.prismaService.client.features.findFirst({
            where: {
                name: featureName as string,
                status: true,
                role: "PEGAWAI",
            },
        });

        if (!feature) throw new ServiceUnavailableException("You don't have access to this feature");


        if (!isJSON(feature.group)) return true;

        const parseJson = JSON.parse(feature.group);

        if (!parseJson) return true;

        const checkFeature = parseJson.includes(pegawai.group);
        if (!checkFeature) throw new ServiceUnavailableException("You don't have access to this feature");

        return true

    }

}