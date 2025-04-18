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

const chalk = require("chalk");
async function main() {

    console.log(chalk.greenBright(figlet.textSync("Konfigurasi Database", { horizontalLayout: "full" })));
    console.log(chalk.gray(`Copyright © ${new Date().getFullYear()} TIM IT SMK Negeri 1 Pekalongan. All rights reserved.\n`));

    const option = await askQuestion(chalk.yellow(`Pilih opsi: \n 1. Buat user superadmin \n 2. Reset Semua User \n 3. Sync Permissions \n 4. Keluar \n`))

    if (!isNaN(Number(option))) {
        switch (Number(option)) {
            case 1:
                console.clear()
                console.log(chalk.greenBright(figlet.textSync("Buat User Superadmin", { horizontalLayout: "full" })));
                createSuperAdmin()
                break;
            case 2:
                console.clear()
                console.log(chalk.redBright(figlet.textSync("Hapus Semua User", { horizontalLayout: "full" })));
                removeAllUser()
                break;
            case 3:
                console.clear()
                console.log(chalk.yellowBright(figlet.textSync("Sync Permissions", { horizontalLayout: "full" })));
                syncPermissions()
                break;
            case 4:
                console.log(chalk.red('Keluar...'));
                readline.close()
                return;
            default:
                console.log(chalk.red('Opsi tidak valid'));
                readline.close()
                return;
        }
    }
    return;


}

async function createSuperAdmin() {
    const username: string = await askQuestion(chalk.yellow("Masukan username: "))
    const password: string = await askQuestion(chalk.yellow("Masukan password: "))
    const name: string = await askQuestion(chalk.yellow("Masukan nama: "))


    if (username && name && password) {
        // check if user superadmin already exists
        const user = await prisma.users.findFirst({
            where: {
                roles: {
                    name: 'superadmin'
                }
            }
        })
        if (user) {
            console.log(chalk.red('User superadmin sudah ada, silahkan bisa sync permissions untuk menambahkan permission baru'));
            console.log(chalk.red('Atau hapus semua data untuk menghapus user superadmin'));
            readline.close()
            return;
        }


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

                // check if superadmin role already exists
                const checkSuperAdmin = await prisma.roles.findFirst({
                    where: {
                        name: 'superadmin'
                    }
                })
                if (checkSuperAdmin) {
                    console.log(chalk.red('Role superadmin sudah ada, silahkan bisa sync permissions untuk menambahkan permission baru'));
                    console.log(chalk.red('Atau hapus semua data untuk menghapus role superadmin'));
                    readline.close()
                    return;
                }
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

async function removeAllUser() {
    const users = await prisma.users.findMany()
    if (users) {
        await prisma.users.deleteMany({
            where: {
                id: {
                    in: users.map(user => user.id)
                }
            }
        })
    }
    console.log(chalk.red('Semua user berhasil dihapus'));
    readline.close()
}

async function syncPermissions() {
    // search superadmin role
    const superadminRole = await prisma.roles.findFirst({
        where: {
            name: 'superadmin'
        }
    })

    if (superadminRole) {
        await prisma.role_permissions.deleteMany({
            where: {
                roleId: superadminRole.id
            }
        })
        const checkSuperAdmin = await prisma.users.findFirst({
            where: {
                rolesId: superadminRole.id
            }
        })
        if (!checkSuperAdmin) {
            const createUserQuestion = await askQuestion(chalk.yellow('Apakah anda ingin membuat user superadmin? (y/n) '))
            if (createUserQuestion === 'y') {
                const username = await askQuestion(chalk.yellow("Masukan username: "))
                const password = await askQuestion(chalk.yellow("Masukan password: "))
                const name = await askQuestion(chalk.yellow("Masukan nama: "))
                if (username && name && password) {
                    await prisma.users.create({
                        data: {
                            name,
                            username,
                            password: await hash(password),
                            rolesId: superadminRole.id
                        },
                    });
                    console.log(chalk.green('User berhasil dibuat'));
                }

            }
        }


        // update permissions
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

                const rolePermissions = await prisma.role_permissions.createMany({
                    data: permissionsResult.map(permission => {
                        return {
                            permissionId: permission.id,
                            roleId: superadminRole.id
                        }
                    })
                })


                if (rolePermissions) {
                    console.log(chalk.green('Permissions berhasil disinkronisasi'));
                    readline.close()
                }
            }, 500)
        }

        return;
    } else {
        const userSuperAdmin = await prisma.users.findFirst({
            where: {
                roles: {
                    name: 'superadmin'
                }
            }
        })


        const questionCreateSuperAdmin = await askQuestion(chalk.yellow('Apakah anda ingin membuat user superadmin? (y/n) '))
        if (questionCreateSuperAdmin === 'y') {
            await prisma.permissions.deleteMany()

            const superAdminRole = await prisma.roles.create({
                data: {
                    name: 'superadmin',
                }
            })

            if (superAdminRole) {
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
                }

                setTimeout(async () => {
                    const permissionsResult = await prisma.permissions.findMany()

                    const rolePermissions = await prisma.role_permissions.createMany({
                        data: permissionsResult.map(permission => {
                            return {
                                permissionId: permission.id,
                                roleId: superAdminRole.id
                            }
                        })
                    })


                    if (rolePermissions) {
                        if (userSuperAdmin) {
                            const user1 = await prisma.users.update({
                                where: {
                                    id: userSuperAdmin.id
                                },
                                data: {
                                    rolesId: superAdminRole.id
                                }
                            });

                            console.log(chalk.green('User berhasil diupdate'), { user1 });

                            readline.close()
                        } else {
                            const user1 = await prisma.users.create({
                                data: {
                                    name: 'Super Admin',
                                    username: 'superadmin',
                                    password: await hash('superadmin'),
                                    rolesId: superAdminRole.id
                                },
                            });

                            console.log(chalk.green('User berhasil dibuat'), { user1 });

                            readline.close()
                        }

                    }
                }, 500)
            }
            console.log(chalk.green('User superadmin berhasil dibuat'));

        } else {
            console.log(chalk.red('User superadmin tidak dibuat'));
            readline.close()
            return;
        }


    }


}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });