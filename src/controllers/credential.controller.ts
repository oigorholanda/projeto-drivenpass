import { Request, Response } from "express";
import credentialRepository from "../repositories/credential.repository.js";
import httpStatus from "http-status";

async function listAll(req:Request, res: Response) {
    const allCredentials = await credentialRepository.listAll()
    return res.send(allCredentials)
}

async function getCredentials(req:Request, res: Response) {
    
    try {
        const userId = res.locals.userId
        
        const credentials = await credentialRepository.getCredentials(userId)

        return res.send(credentials)
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error) 
    }
    
    
}


async function findCredential(req:Request, res: Response) {
    
}

async function newCredential(req:Request, res: Response) {
    
}

async function deleteCredential(req:Request, res: Response) {
    
}

export { listAll, getCredentials, newCredential, deleteCredential, findCredential }