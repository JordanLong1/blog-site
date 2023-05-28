import { db } from './db.server';
import bcrypt from 'bcrypt'


type LoginType = {
    username: string,
    password: string
}

export async function login({username, password}: LoginType) {
    const existingUser = await db.user.findFirst({where: {username}});
    if (!existingUser) {
        return null;
    }
    const passwordsMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordsMatch) {
        return null; // add form validation
    }
    return existingUser;
}