import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

export type JWTPayload = {userId: number}

export async function autorizeToken(req:Request, res: Response, next: NextFunction) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(httpStatus.UNAUTHORIZED).send("Invalid Token, please log in again");        
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).send("Invalid Token, please log in again");        
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

        res.locals.userId = user.userId
        console.log(user);
        
        next()

    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).send("Invalid Token, please log in again");
    }
}

