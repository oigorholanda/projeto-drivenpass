import {faker} from '@faker-js/faker';
import { Credential, User } from '@prisma/client';
import { createUser } from './users.factory';
import prisma from '../../src/config/database.js';
import Cryptr from 'cryptr';

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

export async function createCredential(user?: User): Promise<Credential> {
  const incomingUser = user || (await createUser());

  const password = cryptr.encrypt(faker.internet.password(10));

  return prisma.credential.create({
    data: {
      title: faker.lorem.sentence(),
      url: faker.internet.url(),
      username: faker.internet.userName(),
      password: password,
      userId: incomingUser.id,
    },
  });
}
