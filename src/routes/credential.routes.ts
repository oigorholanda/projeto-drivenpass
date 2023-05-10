import { Router } from "express";
import { autorizeToken } from "../middlewares/auth.middleware.js";
import { findCredential, deleteCredential, getCredentials, newCredential, listAll } from "../controllers/credential.controller.js";

const credentialRoutes = Router();

credentialRoutes.all('/*', autorizeToken);
credentialRoutes.get('/all', listAll)
credentialRoutes.get('', getCredentials)
credentialRoutes.get('/:id', findCredential)
credentialRoutes.post('/new', newCredential);
credentialRoutes.delete('/:id', deleteCredential);

export default credentialRoutes;