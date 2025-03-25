import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CustomPrismaService } from 'nestjs-prisma'
import { PERMISSION_KEY } from 'src/decorators/permission.decorator'
import { ExtendedPrismaClient } from 'src/prisma.extension'
@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector, @Inject('PrismaService') private prismaService: CustomPrismaService<ExtendedPrismaClient>,) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
            context.getHandler(),
        ])

        if (!requiredPermissions) {
            return true
        }

        const { user } = context.switchToHttp().getRequest()

        if (!user) throw new UnauthorizedException()

        const role = await this.prismaService.client.roles.findUnique({
            where: {
                id: user.role
            }
        })

        if (!role) throw new UnauthorizedException("Role not found")

        const permissions = await this.prismaService.client.role_permissions.findMany({
            where: {
                roleId: user.role
            },
            select: {
                permission: true
            }
        })

        return requiredPermissions.some(permission => permissions.map(p => p.permission.name).includes(permission))
    }
}