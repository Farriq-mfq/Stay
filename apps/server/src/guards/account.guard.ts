import { BadRequestException, CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AccountableType } from "@prisma/client";
import { CustomPrismaService } from "nestjs-prisma";
import { ExtendedPrismaClient } from "src/prisma.extension";

@Injectable()
export class AccountGuard implements CanActivate {
    constructor(
        @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const user = request.user

        const userId = user.sub

        if (!user || !userId) throw new UnauthorizedException()

        const account = await this.prismaService.client.account.findFirst({
            where: {
                accountableId: +userId,
                accountableType: AccountableType.USER
            }
        })
        if (!account) throw new BadRequestException("CREATE_ACCOUNT_FIRST")

        return true
    }
}
