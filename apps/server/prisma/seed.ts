import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

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
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });