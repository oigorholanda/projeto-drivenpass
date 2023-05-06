import { UserInput } from "protocols";
import userRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt"

async function createUser({ email, password }: UserInput) {
    const duplicatedUser = await userRepository.findUser(email)
    if (duplicatedUser) {
        throw new Error("User already existis!");
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    return userRepository.createUser({
        email,
        password: hashedPassword
    })
}

export default { createUser }