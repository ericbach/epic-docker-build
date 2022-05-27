import { PrismaClient } from '@prisma/client';

console.log('[LAYER] Initializing Prisma Client');
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://janedoe:mypassword@localhost:5432/mydb?schema=sample',
    },
  },
});
console.log('[LAYER] Prisma Client:', prisma);

// TEST: Prisma creating a user in the DB via prisma client
export async function createUser() {
  console.log('[LAYER] Creating User with client:', prisma);

  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
    },
  });

  console.log('[LAYER] Looking for user');
  const allUsers = await prisma.user.findMany({});
  console.log('[LAYER] Found user: ', JSON.stringify(allUsers));

  return allUsers;
}

export const run = async () => {
  return '[LAYER] Done';
};

// TEST: External package depedency
export * from 'uuid';

// TEST: Custom code
export function double(a: number): number {
  console.log('[LAYER] Doubling number:', a);
  return a * 2;
}
