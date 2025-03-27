import { permissions, PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { readFile } from 'fs';
import * as path from 'path';
import { createInterface } from 'readline'
import * as figlet from 'figlet'
const prisma = new PrismaClient();

const loadChalk = async () => {
    const chalk = (await import('chalk')).default;
    return chalk;
};


const readline = createInterface({
    input: process.stdin,
    output: process.stdout
})

const askQuestion = (question): Promise<string> => {
    return new Promise((resolve) => {
        readline.question(question, (answer) => resolve(answer));
    });
};

async function main() {
    const chalk = require("chalk");

    console.log(chalk.greenBright(figlet.textSync("Konfigurasi Data User", { horizontalLayout: "full" })));
    console.log(chalk.gray(`Copyright © ${new Date().getFullYear()} TIM IT SMK Negeri 1 Pekalongan. All rights reserved.\n`));

    const username: string = await askQuestion(chalk.yellow("Masukan username: "))
    const password: string = await askQuestion(chalk.yellow("Masukan password: "))
    const name: string = await askQuestion(chalk.yellow("Masukan nama: "))


    if (username && name && password) {


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
                            name,
                            username,
                            password: await hash(password),
                            rolesId: superAdminRole.id
                        },
                    });

                    console.log(chalk.green('User berhasil dibuat'), { user1 });

                    readline.close()

                }
            }, 500)
        } else {
            console.log(chalk.red('username, name, password not found'))

        }
    }



}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });