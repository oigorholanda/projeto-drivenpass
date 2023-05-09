import { Router } from "express";
import { autorizeToken } from "../middlewares/auth.middleware.js";
import { findCredential, deleteCredential, getCredentials, newCredential } from "../controllers/credential.controller.js";

const credentialRoutes = Router();

credentialRoutes.all('/*', autorizeToken);
credentialRoutes.get('', getCredentials)
credentialRoutes.get('/:id', findCredential)
credentialRoutes.post('/new', newCredential);
credentialRoutes.delete('/:id', deleteCredential);

export default credentialRoutes;