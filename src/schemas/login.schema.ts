import Joi from "joi";
import { UserInput } from "protocols";

const loginSchema = Joi.object<UserInput>({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export default loginSchema