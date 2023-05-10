import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import networkService from '../services/network.service.js';
import { NetworkInput } from 'protocols.js';

async function networksList(req: Request, res: Response) {
    const userId = res.locals.userId

  try {
    const networks = await networkService.listNetwork(userId);
    return res.status(httpStatus.OK).send(networks);
  } catch (error) {
    if (error.type === "NotFoundError") {
        return res.status(httpStatus.NOT_FOUND).send(error.message)
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

async function networksShow(req: Request, res: Response) {
    const userId = res.locals.userId
    const networkId = Number(req.params.id);
    if (!networkId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const networks = await networkService.showNetwork(userId, networkId);
    return res.status(httpStatus.OK).send(networks);
  } catch (error) {
    if (error.type === "NotFoundError") {
        return res.status(httpStatus.NOT_FOUND).send(error.message)
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

async function networksStore(req: Request, res: Response) {
  const { title, network, password } = req.body as NetworkInput;
  const userId = res.locals.userId

  try {
    const response = await networkService.createNetwork({ userId, title, network, password });
    return res.status(httpStatus.CREATED).json({
      networkId: response.id,
    });
  } catch (error) {
    if (error.type === "DuplicatedTitleError") {
      return res.status(httpStatus.CONFLICT).send(error.message);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

async function networksDestroy(req: Request, res: Response) {
    const userId = res.locals.userId
    const networkId = Number(req.params.id);
    if (!networkId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    await networkService.destroyNetwork(userId, networkId);
    return res.sendStatus(httpStatus.ACCEPTED);
  } catch (error) {
    if (error.type === "NotFoundError") {
        return res.status(httpStatus.NOT_FOUND).send(error.message)
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

export { networksList, networksShow, networksStore, networksDestroy }