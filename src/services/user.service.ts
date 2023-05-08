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
    const validUser = await userRepository.findUser(email)

    if (!validUser) {
        throw { type: "InvalidCredentialsError", message: "Email or password are incorrect!"}
    } 

    const validPassword = await bcrypt.compare(password, validUser.password)
    if (!validPassword) {
        throw { type: "InvalidCredentialsError", message: "Email or password are incorrect!"}
    }

   const userId = validUser.id
   delete validUser.password
   

    const token = jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '3h' })

    return {
        User: validUser,
        token
    }
}

export default { createUser, logUser }