import { Router } from 'express';
import { autorizeToken } from '../middlewares/auth.middleware.js';
import { validateSchema } from 'middlewares/validate.schema';
import { networksDestroy, networksList, networksShow, networksStore } from '../controllers/network.controller.js';

const networksRouter = Router();

networksRouter.all('/*', autorizeToken);
networksRouter.get('/', networksList);
networksRouter.get('/:networkId', networksShow);
networksRouter.post('/', networksStore);
networksRouter.delete('/:networkId', networksDestroy);

export { networksRouter };