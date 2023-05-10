import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createUser } from '../factories';
import { cleanDb } from '../helpers';
import prisma from '../../src/config/database.js';
import app from '../../src/app.js';
import Cryptr from 'cryptr';

beforeAll(async () => {
  //await init();
  await cleanDb();
});

const server = supertest(app);
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

describe('GET /user', () => {
  it('should respond with status 200', async () => {
    const response = await server.post('/user');

    expect(response.status).toBe(httpStatus.OK);
  });
})


describe('POST user/login', () => {
  it('should respond with status 422 when body is not given', async () => {
    const response = await server.post('user/login');

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should respond with status 422 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('user/login').send(invalidBody);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  describe('when body is valid', () => {
    const generateValidBody = (passwordLength = 10) => ({
      email: faker.internet.email(),
      password: faker.internet.password(passwordLength),
    });

    it('should respond with status 422 if the password has less than 10 characters', async () => {
      const body = generateValidBody(6);

      const response = await server.post('user/login').send(body);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should respond with status 401 if there is no user for given email', async () => {
      const body = generateValidBody();

      const response = await server.post('user/login').send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is a user for given email but password is not correct', async () => {
      const body = generateValidBody();
      await createUser(body);

      const response = await server.post('user/login').send({
        ...body,
        password: faker.lorem.word(10),
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when credentials are valid', () => {
      it('should respond with status 200', async () => {
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post('user/login').send(body);

        expect(response.status).toBe(httpStatus.OK);
      });

      it('should respond with session token', async () => {
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post('user/login').send(body);

        expect(response.body.token).toBeDefined();
      });
    });
  });
});


describe('POST /users/new', () => {
  it('should respond with status 422 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('/users/new').send(invalidBody);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  describe('when body is valid', () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    it('should respond with status 409 when there is an user with given email', async () => {
      const body = generateValidBody();
      await createUser(body);

      const response = await server.post('/users/new').send(body);

      expect(response.status).toBe(httpStatus.CONFLICT);
      expect(response.body).toEqual("User already existis!");
    });

    it('should respond with status 201 and create user when given email is unique', async () => {
      const body = generateValidBody();

      const response = await server.post('/users/new').send(body);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        email: body.email,
      });
    });

    it('should not return user password on body', async () => {
      const body = generateValidBody();

      const response = await server.post('/users').send(body);

      expect(response.body).not.toHaveProperty('password');
    });

    it('should save user on db', async () => {
      const body = generateValidBody();

      const response = await server.post('/users').send(body);

      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });
      expect(user).toEqual(
        expect.objectContaining({
          id: response.body.id,
          email: body.email,
        }),
      );
    });
  });
});
