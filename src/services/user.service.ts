import { UserInput } from "protocols";
import userRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

async function createUser({ email, password }: UserInput) {
    const duplicatedUser = await userRepository.findUser(email)
    if (duplicatedUser) {
        throw { type: "ConflictError", message: "User already existis!"}
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    return userRepository.createUser({
        email,
        password: hashedPassword
    })
}

async function logUser({ email, password }: UserInput) {
    const isValidUser = await userRepository.findUser(email)

    if (!isValidUser) {
        throw { type: "InvalidCredentialsError", message: "Email or password are incorrect!"}
    } 

    const isValidPassword = await bcrypt.compare(password, isValidUser.password)
    if (!isValidPassword) {
        throw { type: "InvalidCredentialsError", message: "Email or password are incorrect!"}
    }

   const userId = isValidUser.id
   delete isValidUser.password
   

    const token = jwt.sign({userId}, process.env.JWT_SECRET)

    return {
        User: isValidUser,
        token
    }
}

export default { createUser, logUser }