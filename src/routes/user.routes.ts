import { Router } from "express";
import { listAll, logUser, newUser } from "../controllers/userController.js";

const userRoutes = Router()

userRoutes.get('/', listAll)
userRoutes.post('/sign-up', newUser)
userRoutes.post('/login', logUser)

export default userRoutes