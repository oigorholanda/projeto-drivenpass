import { Credential, User } from "@prisma/client";

export type UserInput = Omit<User, "id">

export type CredentialInput = Omit<Credential, "id" | "userId">