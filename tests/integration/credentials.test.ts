import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createCredential } from '../factories/credentials.factory';
import app from '../../src/app.js';
import Cryptr from 'cryptr';



beforeAll(async () => {
  //await init();
  await cleanDb();
});

const server = supertest(app);
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

describe('GET /credentials', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/credentials');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user has no credentials', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and the credentials', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const credential1 = await createCredential(user);
      const credential2 = await createCredential(user);

      const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([
        {
          ...credential1,
          password: cryptr.decrypt(credential1.password),
        },
        {
          ...credential2,
          password: cryptr.decrypt(credential2.password),
        },
      ]);
    });
  });
});

describe('GET /credentials/:id', () => {
  it('should respond with status 401 if no token is given', async () => {
    const credentialId = faker.random.numeric();
    const response = await server.get(`/credentials/${credentialId}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const credentialId = faker.random.numeric();
    const token = faker.lorem.word();

    const response = await server.get(`/credentials/${credentialId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const credentialId = faker.random.numeric();
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get(`/credentials/${credentialId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user has no credentials', async () => {
      const credentialId = faker.random.numeric();
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get(`/credentials/${credentialId}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when credential doesnt belongs to user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const otherUser = await createUser();

      const credential = await createCredential(otherUser);

      const response = await server.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and the credential', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const credential = await createCredential(user);

      const response = await server.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual({
        ...credential,
        password: cryptr.decrypt(credential.password),
      });
    });
  });
});

describe('POST /credentials/new', () => {
  const generateValidBody = () => ({
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  });

  it('should respond with status 401 if no token is given', async () => {
    const credential = generateValidBody();
    const response = await server.post('/credentials/new').send({ ...credential });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const credential = generateValidBody();

    const response = await server
      .post('/credentials/new')
      .send({ ...credential })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const credential = generateValidBody();

    const response = await server
      .post('/credentials/new')
      .send({ ...credential })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 409 if exists other credential with the same title.', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const credential = generateValidBody();

    const credential2 = await createCredential(user);

    credential.title = credential2.title;

    const response = await server
      .post(`/credentials/new`)
      .send({ ...credential })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 201 and credentialId when the user send the right data.', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const credential = generateValidBody();

    const response = await server
      .post(`/credentials/new`)
      .send({ ...credential })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual({
      credentialId: expect.any(Number),
    });
  });
});

describe('DELETE /credentials/:id', () => {
  it('should respond with status 401 if no token is given', async () => {
    const credential = await createCredential();
    const response = await server.delete(`/credentials/${credential.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const credential = await createCredential();

    const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const credential = await createCredential();

    const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if the credential doesnt exists', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.delete(`/credentials/1`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if the credential exists, but doesnt belongs to user', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const credential = await createCredential();

    const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 202 when the user send the right data.', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const credential = await createCredential(user);

    const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.ACCEPTED);
  });
});
