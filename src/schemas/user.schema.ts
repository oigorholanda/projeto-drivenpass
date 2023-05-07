import Joi from "joi";
import { UserInput } from "protocols";

const userSchema = Joi.object<UserInput>({
    email: Joi.string().email().required(),
    password: Joi.string().min(10).required()
})

export default userSchema