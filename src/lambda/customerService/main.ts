/* eslint-disable import/extensions, import/no-absolute-path */
import { v4 as uuidv4, double, createUser, prisma } from '/opt/client';
import { execSync } from 'child_process';

export const handler = async () => {
  console.log('./', execSync('ls -l', { encoding: 'utf8' }));
  console.log('/', execSync('ls -l /', { encoding: 'utf8' }));
  console.log('/opt', execSync('ls -l /opt', { encoding: 'utf8' }));

  console.log('[FUNCTION URL] New GUID: ', uuidv4());
  console.log('[FUNCTION URL] Double 5: ', double(5));
  console.log('[FUNCTION URL] Prisma Client: ', prisma);

  console.log('[FUNCTION URL] Creating a user...');
  const users = await createUser();
  console.log('[FUNCTION URL] Created user: ', users);
};
