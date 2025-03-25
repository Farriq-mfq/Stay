import { permissions, PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { readFile } from 'fs';
import * as path from 'path';
const prisma = new PrismaClient();

async function main() {

    const permissions = await new Promise<Record<'keys' | 'data', any>>((resolve, reject) => {
        readFile(path.resolve(__dirname, '../data/permissions.json'), 'utf-8', function (err, data) {
            if (err) {
                throw err
            }
            const myData = JSON.parse(data) as Record<string, string[]>;
            const keys = Object.keys(myData);

            resolve({
                data: myData,
                keys: keys
            })
        });
    })

    if (permissions.data && permissions.keys) {
        Object.values(permissions.keys).forEach(key => {
            permissions.data[key as string].forEach(async (permission) => {
                await prisma.permissions.upsert({
                    where: {
                        name: `${key}:${permission}`
                    },
                    update: {
                        name: `${key}:${permission}`
                    },
                    create: {
                        name: `${key}:${permission}`
                    }
                })
            })
        })

        setTimeout(async () => {
            const permissionsResult = await prisma.permissions.findMany()

            const superAdminRole = await prisma.roles.create({
                data: {
                    name: 'superadmin',
                }
            });


            const rolePermissions = await prisma.role_permissions.createMany({
                data: permissionsResult.map(permission => {
                    return {
                        permissionId: permission.id,
                        roleId: superAdminRole.id
                    }
                })
            })


            if (rolePermissions) {
                const user1 = await prisma.users.create({
                    data: {
                        name: 'farriq',
                        username: 'farriq',
                        password: await hash('farriq'),
                        rolesId: superAdminRole.id
                    },
                });

                console.log({ user1 });
            }
        }, 500)
    }



}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });