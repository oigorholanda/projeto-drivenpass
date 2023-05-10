import { Request, Response } from "express";
import userRepository from "../repositories/user.repository";
import { UserInput } from "protocols";
import userService from "../services/user.service";
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

    try {
        const validUser = await userService.logUser( UserInput )

        console.log(validUser); 

        return res.status(httpStatus.OK).send(validUser)
    } catch (error) {
        if (error.type === "InvalidCredentialsError") {
            return res.status(httpStatus.UNAUTHORIZED).send(error.message) 
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error) 
    }
}


export { listAll, newUser, logUser }

