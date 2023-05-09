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

async function findOneById(id: number) {         
    return prisma.credential.findUnique({
        where: {
            id
        },
    })
}

async function findByTitle(userId: number, title: string) {
    return prisma.credential.findFirst({
      where: {
        userId,
        title,
      },
    });
  }

async function newCredential(credential: CredentialInput, userId: number) {
    return prisma.credential.create({
        data: {
            ...credential, 
            userId
        }
    });
}

async function destroy(credentialId: number) {
    return prisma.credential.delete({
      where: {
        id: credentialId,
      },
    });
  }




export default { listAll, newCredential, getCredentials, findOneById, destroy, findByTitle }