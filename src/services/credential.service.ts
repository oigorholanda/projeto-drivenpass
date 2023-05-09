import credentialRepository from "repositories/credential.repository";
import Cryptr from 'cryptr';
import { CredentialInput } from "protocols";

const cryptr = new Cryptr(process.env.CRYPTR_KEY);

async function getCredentials(userId: number) {
    const credentials =  await credentialRepository.getCredentials(userId);

    if (credentials.length === 0) {
        throw { type: "NotFoundError", message: "No result for this search!"};
    }

    credentials.map((credential) => (credential.password = cryptr.decrypt(credential.password)));
    return credentials;
}


async function getCredentialsById(userId: number, credentialId: number) {
    const credential = await credentialRepository.findOneById(credentialId);

    if (!credential || credential.userId !== userId) {
      throw { type: "NotFoundError", message: "No result for this search!"};
    }
  
    credential.password = cryptr.decrypt(credential.password);
    return credential;
  }


async function createCredential(userId: number, {title,url,username,password}: CredentialInput) {
    const uniqueTitle = await credentialRepository.findByTitle(userId, title);
    if (!uniqueTitle) {
        throw { type: "DuplicatedTitleError", message: "There is already a credential with given title!"};  
    }
  
    const hashedPassword = cryptr.encrypt(password);
    return credentialRepository.newCredential({
      title,
      url,
      username,
      password: hashedPassword,
    }, userId);
  }

async function destroyCredential(userId: number, credentialId: number) {
    const credential = await credentialRepository.findOneById(credentialId);
    if (!credential || credential.userId !== userId) {
      throw { type: "NotFoundError", message: "No result for this search!"};
    }
  
    await credentialRepository.destroy(credentialId);
  }



export default { getCredentials, getCredentialsById, createCredential, destroyCredential }