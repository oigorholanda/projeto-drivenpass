import { Request, Response } from "express";
import prisma from "../config/database.js";

async function getUsers() {
    return prisma.user.findMany()
}

async function createUser() {
    return [] 
    //? prisma.user.create({data: {user: anna}})
}

export { getUsers, createUser }