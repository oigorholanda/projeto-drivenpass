import { Network } from '@prisma/client';
import Cryptr from 'cryptr';
import networkRepository from '../repositories/network.repository.js';


const cryptr = new Cryptr(process.env.CRYPTR_KEY);


async function listNetwork(userId: number) {
  const networks = await networkRepository.listNetwork(userId);
  if (networks.length === 0) {
    throw { type: "NotFoundError", message: "No result for this search!"};
  }

  networks.map((network) => (network.password = cryptr.decrypt(network.password)));
  return networks;
}

async function showNetwork(userId: number, networkId: number) {
  const network = await networkRepository.findById(networkId);
  if (!network || network.userId !== userId) {
    throw { type: "NotFoundError", message: "No result for this search!"};
  }

  network.password = cryptr.decrypt(network.password);
  return network;
}

export async function createNetwork({ userId, title, network, password }: CreateNetworkParams): Promise<Network> {
  await validateUniqueTitleOrFail(userId, title);

  const hashedPassword = cryptr.encrypt(password);
  return networkRepository.create({
    userId,
    title,
    network,
    password: hashedPassword,
  });
}

async function destroyNetwork(userId: number, networkId: number) {
  const network = await networkRepository.findById(networkId);
  if (!network || network.userId !== userId) {
    throw { type: "NotFoundError", message: "No result for this search!"};
  }

  await networkRepository.destroy(networkId);
}

async function validateUniqueTitleOrFail(userId: number, title: string) {
  const networkWithSameTitle = await networkRepository.findByTitle(userId, title);
  if (networkWithSameTitle) {
    throw { type: "DuplicatedTitleError", message: "There is already a credential with given title!"};
  }
}

export type CreateNetworkParams = Pick<Network, 'userId' | 'title' | 'network' | 'password'>;

const networkService = {
  listNetwork,
  showNetwork,
  createNetwork,
  destroyNetwork,
};

export default networkService;