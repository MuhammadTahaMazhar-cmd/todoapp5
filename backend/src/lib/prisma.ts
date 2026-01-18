import { PrismaClient } from '@prisma/client';

/**
 * Email normalization helper - fixes login issues with case-sensitive emails
 */
export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

/**
 * Prisma Client instance for Better Auth
 * This is used by Better Auth adapter
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// Add middleware to normalize emails on create and update
prismaClient.$use(async (params, next) => {
  // Normalize email on User create/update
  if (params.model === 'User') {
    if (params.action === 'create' && params.args.data?.email) {
      params.args.data.email = normalizeEmail(params.args.data.email);
    }
    if (params.action === 'update' && params.args.data?.email) {
      params.args.data.email = normalizeEmail(params.args.data.email);
    }
    if (params.action === 'upsert') {
      if (params.args.create?.email) {
        params.args.create.email = normalizeEmail(params.args.create.email);
      }
      if (params.args.update?.email) {
        params.args.update.email = normalizeEmail(params.args.update.email);
      }
    }
  }

  // Normalize accountId on Account create/update (for credential provider)
  if (params.model === 'Account') {
    if (params.action === 'create' && params.args.data?.accountId && params.args.data?.providerId === 'credential') {
      params.args.data.accountId = normalizeEmail(params.args.data.accountId);
    }
    if (params.action === 'update' && params.args.data?.accountId && params.args.data?.providerId === 'credential') {
      params.args.data.accountId = normalizeEmail(params.args.data.accountId);
    }
    if (params.action === 'upsert') {
      if (params.args.create?.accountId && params.args.create?.providerId === 'credential') {
        params.args.create.accountId = normalizeEmail(params.args.create.accountId);
      }
      if (params.args.update?.accountId) {
        params.args.update.accountId = normalizeEmail(params.args.update.accountId);
      }
    }
  }

  return next(params);
});

export const prisma = prismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
