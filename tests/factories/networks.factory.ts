import {faker} from '@faker-js/faker';
import { Network, User } from '@prisma/client';
import { createUser } from './users.factory';
import prisma from '../../src/config/database.js';
import Cryptr from 'cryptr';

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

export async function createNetwork(user?: User) {
  const incomingUser = user || (await createUser());

  const password = cryptr.encrypt(faker.internet.password(10));

  return prisma.network.create({
    data: {
      title: faker.lorem.sentence(),
      network: faker.lorem.sentence(),
      password: password,
      userId: incomingUser.id,
    },
  });
}
