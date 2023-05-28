import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'


type LoginType = {
    username: string,
    password: string
}

export async function login({username, password}: LoginType) {
    const prisma = await new PrismaClient();
    const existingUser = await prisma.user.findFirst({where: {username}});
    if (!existingUser) {
        return null;
    }
    const passwordsMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordsMatch) {
        return null; // add form validation
    }
    return existingUser;
}