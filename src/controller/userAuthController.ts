import bcrypt from 'bcrypt';
import prisma from '../utils/db';
import { Request, Response } from 'express';
import { bcryptSaltRound } from '../Constants';
import { Snowflake } from '@theinternetfolks/snowflake';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Logger, createJwtPayload, errorResponse, successResponse } from '../utils';

const publicResponseApi = {
  id: true,
  name: true,
  email: true,
  created_at: true,
};

async function createUser(req: Request, res: Response) {
  const { name, email, password } = req.body;
  try {
    const userId = Snowflake.generate();
    const hashPassword = await bcrypt.hash(password, bcryptSaltRound);
    const data = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        id: userId,
      },
      select: publicResponseApi,
    });
    const access_token = createJwtPayload({ userId });
    res.status(200).json(successResponse(data, { access_token }));
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(400).json(
          errorResponse({
            param: 'email',
            code: 'RESOURCE_EXISTS',
            message: 'User with this email address already exists.',
          }),
        );
      }
      return;
    }
    Logger.error(err);
    res.status(500).json(
      errorResponse({
        code: 'SERVICE_ERROR',
        message: 'Internal Service Error',
      }),
    );
  }
}

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const userInfo = await prisma.user.findFirstOrThrow({
      where: {
        email,
      },
      select: {
        password: true,
        ...publicResponseApi,
      },
    });

    const { password: passwordHash, ...data } = userInfo;

    const passwordMatch = await bcrypt.compare(password, passwordHash);
    if (!passwordMatch) {
      res.status(400).json(
        errorResponse({
          param: 'password',
          message: 'The credentials you provided are invalid.',
          code: 'INVALID_CREDENTIALS',
        }),
      );
      return;
    }
    const access_token = createJwtPayload({
      userId: data.id,
    });
    res.status(200).json(successResponse(data, { access_token }));
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        res.status(400).json(
          errorResponse({
            param: 'email',
            code: 'INVALID_CREDENTIALS',
            message: 'The credentials you provided are invalid.',
          }),
        );
      }
      return;
    }
    Logger.error(err);
    res.status(500).json(
      errorResponse({
        code: 'SERVICE_ERROR',
        message: 'Internal Service Error',
      }),
    );
  }
}

async function getSelf(req: Request, res: Response) {
  const userId = req.payload.userId;
  try {
    const userInfo = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: publicResponseApi,
    });

    res.status(200).json(successResponse(userInfo));
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      // If this error is recieved then it means there was an valid JWT Token
      // for a user that has been deleted
      if (err.code === 'P2025') {
        res.status(400).json(
          errorResponse({
            message: 'You need to sign in to proceed.',
            code: 'NOT_SIGNEDIN',
          }),
        );
      }
      return;
    }
    Logger.error(err);
    res.status(500).json(
      errorResponse({
        code: 'SERVICE_ERROR',
        message: 'Internal Service Error',
      }),
    );
  }
}

export { loginUser, createUser, getSelf };
