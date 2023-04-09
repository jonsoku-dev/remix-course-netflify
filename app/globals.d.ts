import { PrismaClient } from "@prisma/client";

declare global {
  interface NodeJS {
    __db: PrismaClient;
  }
}

export {};
