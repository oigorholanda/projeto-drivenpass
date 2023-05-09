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
        const { credentialId } = req.params
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
        const userId = res.locals.userId

        const credentials = await credentialService.createCredential(userId, newCredential)

        return res.status(httpStatus.CREATED).send(credentials)
    } catch (error) {
        if (error.name === 'DuplicatedTitleError') {
            return res.status(httpStatus.CONFLICT).send(error.message);
        }
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

async function deleteCredential(req: Request, res: Response) {
    const { credentialId } = req.params
    const userId = res.locals.userId
  
    try {
      await credentialService.destroyCredential(userId, parseInt(credentialId));
      return res.sendStatus(httpStatus.ACCEPTED);
    } catch (error) {
        if (error.type === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send(error.message)
        }
        return res.status(httpStatus.BAD_REQUEST).send(error);
    }
}

export { listAll, getCredentials, newCredential, deleteCredential, findCredential }