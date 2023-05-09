import { Credential } from "@prisma/client";
import prisma from "../config/database.js";
import { CredentialInput } from "protocols.js";

async function listAll() {
    return prisma.credential.findMany();
}

async function getCredentials(userId: number) {         
    return prisma.credential.findMany({
        where: {
            userId
        },
    })
}

async function findOne(id: number) {         
    return prisma.credential.findUnique({
        where: {
            id
        },
    })
}

async function newCredential(credential: CredentialInput, userId: number) {
    return prisma.credential.create({
        data: {
            ...credential, 
            userId
        }
    });
}




export default { listAll, newCredential, getCredentials, findOne }