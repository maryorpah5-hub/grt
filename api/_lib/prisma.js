import { PrismaClient } from '@prisma/client';

// Reuse connection across warm serverless invocations
let prisma;

export function getPrisma() {
  if (!prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    prisma = new PrismaClient();
  }
  return prisma;
}

