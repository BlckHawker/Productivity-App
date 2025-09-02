import { PrismaClient } from "../../generated/prisma";

declare module "express-serve-static-core" {
  interface Request {
    prisma: PrismaClient;
  }
}