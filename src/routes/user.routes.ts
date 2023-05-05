import { Router } from "express";
import { listAll } from "../controllers/userController.js";

const userRoutes = Router()

userRoutes.get('/', listAll)

export default userRoutes