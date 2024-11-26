import { prisma } from "./database.server";
import pkg from 'bcryptjs';
const { hash } = pkg;

export async function signUp({ email, password }) {
    const existingUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (existingUser) {
        // this is not an error Response, this is regular javascript error object
        const error = new Error('a user with the provided email address exists already. ')
        error.status = 422; // 422 is HTTP status code for indicating incorrect user input
        throw error;
    }

    const passwordHash = await hash(password, 12)

    await prisma.user.create({
        data: {
            email: email, password: passwordHash
        }
    })
}