import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

async function main() {
    const user1 = await prisma.users.create({
        data: {
            name: 'farriq',
            username: 'farriq',
            password: await hash('farriq'),
        },
    });

    console.log({ user1 });

    // for (let i = 0; i < 1000; i++) {
    //     await prisma.presences.create({
    //         data: {
    //             siswaId: 1,
    //             method: 'other',
    //             presence_sessionsId: 4,
    //             createdAt: faker.date.anytime()
    //         },
    //     })
    // }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });