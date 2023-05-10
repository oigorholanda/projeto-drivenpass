import { Router } from "express";
import { listAll, logUser, newUser } from "../controllers/user.controller";
import { validateSchema } from "../middlewares/validate.schema";
import userSchema from "../schemas/user.schema";
import loginSchema from "../schemas/login.schema";

const userRoutes = Router();

userRoutes.get('/', listAll)
userRoutes.post('/new', validateSchema(userSchema), newUser)
userRoutes.post('/login', validateSchema(loginSchema), logUser)

export default userRoutes