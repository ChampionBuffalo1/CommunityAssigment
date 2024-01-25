import { Logger } from './Logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
prisma.$connect().then(() => Logger.info('Prisma client connected.'));

export default prisma;
