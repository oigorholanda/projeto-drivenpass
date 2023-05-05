import { Request, Response } from "express";
import prisma from "../config/database.js";

async function getUsers() {
    return prisma.user.findMany()
}

async function createUser(email: string, password: string) {
    return prisma.user.create({
        data: {
            email: email,
            password: password
        }})
}

export { getUsers, createUser }