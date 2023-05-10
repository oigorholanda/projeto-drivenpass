import { Router } from 'express';
import { autorizeToken } from '../middlewares/auth.middleware.js';
import { validateSchema } from 'middlewares/validate.schema';
import { networksDestroy, networksList, networksShow, networksStore } from '../controllers/network.controller.js';

const networkRoutes = Router();

networkRoutes.all('/*', autorizeToken);
networkRoutes.get('/', networksList);
networkRoutes.get('/:id', networksShow);
networkRoutes.post('/new', networksStore);
networkRoutes.delete('/:id', networksDestroy);

export default networkRoutes;