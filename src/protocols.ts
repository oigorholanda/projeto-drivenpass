import { Credential, Network, User } from "@prisma/client";

export type UserInput = Omit<User, "id">

export type CredentialInput = Omit<Credential, "id" | "userId">

export type NetworkInput = Omit<Network, "id" | "userId">