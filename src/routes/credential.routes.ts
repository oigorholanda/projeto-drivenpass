import { Router } from "express";
import { autorizeToken } from "../middlewares/auth.middleware.js";

const credentialRoutes = Router();

credentialRoutes.all('/*', autorizeToken);

export default credentialRoutes;