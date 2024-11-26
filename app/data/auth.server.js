import { prisma } from "./database.server";
import { default as bcrypt } from 'bcryptjs';
import { createCookieSessionStorage, redirect } from "@remix-run/node"

const { hash, compare } = bcrypt;
const SESSION_SECRET = process.env.SESSION_SECRET;

// utility function 
const sessionStorage = createCookieSessionStorage({
    cookie: {
        secure: process.env.NODE_ENV === "production",
        secrets: [SESSION_SECRET], // key to define that cookie is valid or not by backend ,
        sameSite: 'lax', // protection againt mallicious sites to protect user
        maxAge: 30 * 24 * 60 * 60, // 30 days,
        httpOnly: true // this ensures that client side javascript code can't access this cookie
    }
})

// create session for user
async function createUserSession(userId, redirectPath) {
    const session = await sessionStorage.getSession();
    session.set('userId', userId);
    return redirect(redirectPath, {
        headers: {
            'Set-Cookie': await sessionStorage.commitSession(session)
        },

    })
}

// get user from existing session
export async function getUserFromSession(request) {
    const session = await sessionStorage.getSession(request.headers.get('Cookie')) // Cookie header contains session cookie that stored in browser

    const userId = session.get('userId');

    if (!userId) {
        return null;
    }

    return userId;
}


// signUp
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

    const user = await prisma.user.create({
        data: {
            email: email, password: passwordHash
        }
    })

    return createUserSession(user.id, "/expenses");
}


// login
export async function login({ email, password }) {
    const existingUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (!existingUser) {
        const error = new Error('Could not logged you in, please check the provided credentials.')
        error.status = 401;
        throw error;
    }

    const passwordCorrect = await compare(password, existingUser.password)
    if (!passwordCorrect) {
        const error = new Error('Could not logged you in, please check the provided credentials.')
        error.status = 401;
        throw error;
    }

    return createUserSession(existingUser.id, "/expenses");

}

export async function destroyUserSession(request) {
    const session = await sessionStorage.getSession(request.headers.get('Cookie'));
    return redirect("/", {
        headers: {
            'Set-Cookie': await sessionStorage.destroySession(session),

        }
    })

}

export async function requireUserSession(request) {
    const userId = await getUserFromSession(request);
    if (!userId) {
        throw redirect('/auth?mode=login');
    }
    return userId;
}