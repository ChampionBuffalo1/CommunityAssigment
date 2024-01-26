import prisma from '../utils/db';
import { RESULT_PER_PAGE } from '../Constants';
import type { Request, Response } from 'express';
import { Snowflake } from '@theinternetfolks/snowflake';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Logger, errorResponse, successResponse, getPaginatedParameters } from '../utils';

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
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      res.status(400).json(
        errorResponse({
          param: 'name',
          code: 'RESOURCE_EXISTS',
          message: 'Role with this name already exists.',
        }),
      );
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

async function getAllRoles(req: Request, res: Response) {
  try {
    const total = await prisma.role.count();
    const { skip, take, totalPages, currentPage } = getPaginatedParameters(Number(req.query.page), total);

    const roles = await prisma.role.findMany({
      skip,
      take,
    });

    res.status(200).json(
      successResponse(roles, {
        total,
        page: currentPage,
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
