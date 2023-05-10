import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createNetwork } from '../factories/networks.factory';
import app from '../../src/app.js';
import Cryptr from 'cryptr';

beforeAll(async () => {
  //await init();
  await cleanDb();
});

const server = supertest(app);
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

describe('GET /networks', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/networks');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/networks').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user has no networks', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/networks').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and the networks', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const network1 = await createNetwork(user);
      const network2 = await createNetwork(user);

      const response = await server.get('/networks').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([
        {
          ...network1,
          password: cryptr.decrypt(network1.password),
        },
        {
          ...network2,
          password: cryptr.decrypt(network2.password),
        },
      ]);
    });
  });
});

describe('GET /networks/:id', () => {
  it('should respond with status 401 if no token is given', async () => {
    const networkId = faker.random.numeric()

    const response = await server.get(`/networks/${networkId}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const networkId = faker.random.numeric()
    const token = faker.lorem.word();

    const response = await server.get(`/networks/${networkId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const networkId = faker.random.numeric()
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get(`/networks/${networkId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user has no networks', async () => {
      const networkId = faker.random.numeric()
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get(`/networks/${networkId}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when network doesnt belongs to user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const otherUser = await createUser();

      const network = await createNetwork(otherUser);

      const response = await server.get(`/networks/${network.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and the network', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const network = await createNetwork(user);

      const response = await server.get(`/networks/${network.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual({
        ...network,
        password: cryptr.decrypt(network.password),
      });
    });
  });
});

describe('POST /networks/new', () => {
  const generateValidBody = () => ({
    title: faker.lorem.sentence(),
    network: faker.lorem.sentence(),
    password: faker.internet.password(),
  });

  it('should respond with status 401 if no token is given', async () => {
    const network = generateValidBody();
    const response = await server.post('/networks/new').send({ ...network });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const network = generateValidBody();

    const response = await server
      .post('/networks/new')
      .send({ ...network })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const network = generateValidBody();

    const response = await server
      .post('/networks/new')
      .send({ ...network })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 409 if exists other network with the same title.', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const network = generateValidBody();

    const network2 = await createNetwork(user);

    network.title = network2.title;

    const response = await server
      .post(`/networks/new`)
      .send({ ...network })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 201 and networkId when the user send the right data.', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const network = generateValidBody();

    const response = await server
      .post(`/networks/new`)
      .send({ ...network })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual({
      networkId: expect.any(Number),
    });
  });
});

describe('DELETE /networks/:id', () => {
  it('should respond with status 401 if no token is given', async () => {
    const network = await createNetwork();
    const response = await server.delete(`/networks/${network.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const network = await createNetwork();

    const response = await server.delete(`/networks/${network.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const network = await createNetwork();

    const response = await server.delete(`/networks/${network.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if the network doesnt exists', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.delete(`/networks/1`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if the network exists, but doesnt belongs to user', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const network = await createNetwork();

    const response = await server.delete(`/networks/${network.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 202 when the user send the right data.', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const network = await createNetwork(user);

    const response = await server.delete(`/networks/${network.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.ACCEPTED);
  });
});
