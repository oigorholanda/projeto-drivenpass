import { Request, Response } from "express";
import userRepository from "../repositories/user.repository.js";
import { UserInput } from "protocols.js";
import userService from "../services/user.service.js";
import httpStatus from "http-status";

async function listAll(_req: Request, res: Response) {
    const users = await userRepository.getUsers()
    return res.send(users)
}

async function newUser(req: Request, res: Response) {
    const UserInput = req.body as UserInput

    try {
        const newUser = await userService.createUser( UserInput )

        console.log(newUser);
    
        return res.status(httpStatus.CREATED).json({
            id: newUser.id,
            email: newUser.email
        })
    } catch (error) {  
        if (error.type === "ConflictError") {
            return res.status(httpStatus.CONFLICT).send(error.message) 
        }
        return res.status(httpStatus.BAD_REQUEST).send(error)
    }

}

async function logUser(req: Request, res: Response) {
    const UserInput = req.body as UserInput
    const newUser = await userRepository.findUser( UserInput.email )

    console.log(newUser);

    return res.status(200).send(`Logado!`)
}


export { listAll, newUser, logUser }

