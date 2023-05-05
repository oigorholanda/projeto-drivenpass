import { Router } from "express";
import { listAll, newUser } from "../controllers/userController.js";

const userRoutes = Router()

userRoutes.get('/', listAll)
userRoutes.post('/', newUser)

export default userRoutes