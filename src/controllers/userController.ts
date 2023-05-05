import { Request, Response } from "express";
import { createUser, getUsers } from "../repositories/user.repository.js";

async function listAll(req: Request, res: Response) {
    const users = await getUsers()
    return res.send(users)
}

async function newUser(req: Request, res: Response) {
    const {email, password} = req.body
    const users = await createUser( email, password )
    return res.send(users)
}


export { listAll, newUser }

