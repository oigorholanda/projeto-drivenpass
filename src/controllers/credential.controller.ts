import { Request, Response } from "express";
import credentialRepository from "../repositories/credential.repository.js";
import httpStatus from "http-status";
import { CredentialInput } from "protocols.js";
import credentialService from "services/credential.service.js";

async function listAll(req: Request, res: Response) {
    const allCredentials = await credentialRepository.listAll()
    return res.send(allCredentials)
}

async function getCredentials(req: Request, res: Response) {

    try {
        const userId = res.locals.userId

        const credentials = await credentialService.getCredentials(userId)

        return res.status(httpStatus.OK).send(credentials)
    } catch (error) {
        if (error.type === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send(error.message) 
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
    }
}


async function findCredential(req: Request, res: Response) {
    
    try {
        const {credentialId} = req.params
        const userId = res.locals.userId

        const credentials = await credentialService.getCredentialsById(userId, parseInt(credentialId))

        return res.status(httpStatus.OK).send(credentials)
    } catch (error) {
        if (error.type === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send(error.message) 
        }

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
    }
}


async function newCredential(req: Request, res: Response) {
    try {
        const newCredential = req.body as CredentialInput

        const credentials = await credentialRepository.getCredentials(newCredential)

        return res.send(credentials)
    } catch (error) {
        if (error.type === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send(error.message) 
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
    }
}

async function deleteCredential(req: Request, res: Response) {

}

export { listAll, getCredentials, newCredential, deleteCredential, findCredential }