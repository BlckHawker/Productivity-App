import { PrismaClient } from '../../generated/prisma';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    prisma: PrismaClient;
  }
}