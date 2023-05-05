import { Request, Response } from "express";
import { getUsers } from "../repositories/user.repository.js";

async function listAll(req: Request, res: Response) {
    const users = await getUsers()
    return res.send(users)
}

export { listAll }

