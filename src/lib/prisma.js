import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

function createPrisma() {
  return new PrismaClient();
}

function hasStaleClient(client) {
  if (!client) return true;
  return (
    typeof client.orderLead?.create !== 'function' ||
    typeof client.siteSetting?.findUnique !== 'function'
  );
}

export function getPrisma() {
  let client = globalForPrisma.prisma;

  if (hasStaleClient(client)) {
    if (client) void client.$disconnect().catch(() => {});
    client = createPrisma();
    globalForPrisma.prisma = client;
  }

  return client;
}

// Proxy ensures dev HMR never keeps a PrismaClient missing newly added models.
const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getPrisma();
      const value = client[prop];
      return typeof value === 'function' ? value.bind(client) : value;
    },
  }
);

export default prisma;
