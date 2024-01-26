import prisma from '../utils/db';
import type { Request, Response } from 'express';
import { Snowflake } from '@theinternetfolks/snowflake';
import { Logger, errorResponse, successResponse } from '../utils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

async function createRole(req: Request, res: Response) {
  const { name } = req.body;
  try {
    const roleId = Snowflake.generate();
    const data = await prisma.role.create({
      data: {
        id: roleId,
        name,
      },
    });
    res.status(200).json(successResponse(data));
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        res.status(400).json(
          errorResponse({
            param: 'name',
            code: 'RESOURCE_EXISTS',
            message: 'Role with this name already exists.',
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

const RESULT_PER_PAGE = 10;

async function getAllRoles(req: Request, res: Response) {
  try {
    const total = await prisma.role.count();
    const totalPages = Math.ceil(total / 10);
    const page = Math.min(Math.max(Number(req.query.page), 1), totalPages); // [1, total)

    const roles = await prisma.role.findMany({
      take: RESULT_PER_PAGE,
      skip: (page - 1) * RESULT_PER_PAGE,
    });

    res.status(200).json(
      successResponse(roles, {
        page,
        total,
        pages: totalPages,
      }),
    );
  } catch (err) {
    Logger.error(err);
    res.status(500).json(
      errorResponse({
        code: 'SERVICE_ERROR',
        message: 'Internal Service Error',
      }),
    );
  }
}

export { createRole, getAllRoles };
