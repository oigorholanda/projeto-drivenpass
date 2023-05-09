import prisma from "../config/database.js";
import { UserInput } from "protocols.js";

async function getUsers() {
    return prisma.user.findMany()
}

async function createUser(user: UserInput) {
    return prisma.user.create({
        data: user
    })
}

async function findUser(email:string) {         
    return prisma.user.findFirst({
        where: {
            email: email,
        },
    })
}

export default { getUsers, createUser, findUser }