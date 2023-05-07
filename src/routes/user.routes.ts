import { Router } from "express";
import { listAll, logUser, newUser } from "../controllers/user.controller.js";
import { validateSchema } from "../middlewares/validate.schema.js";
import userSchema from "../schemas/user.schema.js";

const userRoutes = Router();

userRoutes.get('/', listAll)
userRoutes.post('/new', validateSchema(userSchema), newUser)
userRoutes.post('/login', logUser)

export default userRoutes