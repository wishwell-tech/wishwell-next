// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// const prisma = globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ['query', 'error', 'warn'],
//     datasources: {
//       db: {
//         url: process.env.DATABASE_URL ?? (() => {
//           console.error('DATABASE_URL is not set');
//           return 'invalid_url';
//         })()
//       },
//     },
//   })

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = prisma
// }

// export { prisma }

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
