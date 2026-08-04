import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

function createPrisma() {
  return new PrismaClient();
}

let prisma = globalForPrisma.prisma ?? createPrisma();

// Dev HMR can keep an old PrismaClient that predates new models (e.g. OrderLead).
if (
  process.env.NODE_ENV !== 'production' &&
  typeof prisma.orderLead?.create !== 'function'
) {
  void prisma.$disconnect().catch(() => {});
  prisma = createPrisma();
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
