import prisma from '../utils/db';
import type { Response, Request } from 'express';
import { Snowflake } from '@theinternetfolks/snowflake';
import { ADMIN_ROLE_NAME, MOD_ROLE_NAME } from '../Constants';
import { Logger, errorResponse, successResponse } from '../utils';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

async function createMember(req: Request, res: Response) {
  const { user, role, community } = req.body;
  const authUserId = req.payload.userId;

  try {
    const authUserRole = await prisma.member.findFirstOrThrow({
      where: {
        userId: authUserId,
        communityId: community,
      },
      select: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (authUserRole.role.name !== ADMIN_ROLE_NAME) {
      res.status(400).json(
        errorResponse({
          message: 'You are not authorized to perform this action.',
          code: 'NOT_ALLOWED_ACCESS',
        }),
      );
      return;
    }

    const roleExists = await prisma.role.findFirst({
      where: {
        id: role,
      },
      select: {
        id: true,
      },
    });
    if (!roleExists?.id) {
      res.status(400).json(
        errorResponse({
          param: 'role',
          message: 'Role not found.',
          code: 'RESOURCE_NOT_FOUND',
        }),
      );
      return;
    }

    const userExists = await prisma.user.findFirst({
      where: {
        id: user,
      },
      select: {
        id: true,
      },
    });

    if (!userExists?.id) {
      res.status(400).json(
        errorResponse({
          param: 'user',
          message: 'User not found.',
          code: 'RESOURCE_NOT_FOUND',
        }),
      );
      return;
    }
    const memberAlreadyExits = await prisma.member.findFirst({
      where: {
        communityId: community,
        userId: user,
        roleId: role,
      },
      select: {
        id: true,
      },
    });

    if (memberAlreadyExits?.id) {
      res.status(400).json(
        errorResponse({
          message: 'User is already added in the community.',
          code: 'RESOURCE_EXISTS',
        }),
      );
      return;
    }

    const memberId = Snowflake.generate();
    // NOTE: Not using this data to send the response since it sends id named as `roleId`, `userId`, etc
    await prisma.member.create({
      data: {
        id: memberId,
        userId: user,
        roleId: role,
        communityId: community,
      },
    });

    res.status(200).json(
      successResponse({
        id: memberId,
        user,
        role,
        community,
      }),
    );
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      res.status(400).json(
        errorResponse({
          param: 'community',
          message: 'Community not found.',
          code: 'RESOURCE_NOT_FOUND',
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

const REQUIRED_ROLES = [ADMIN_ROLE_NAME, MOD_ROLE_NAME];
async function deleteMember(req: Request, res: Response) {
  const id = req.params.id || '';
  try {
    const memberInfo = await prisma.member.findFirstOrThrow({
      where: {
        id,
      },
    });

    const authUserId = req.payload.userId;
    const authUserRole = await prisma.member.findFirst({
      where: {
        userId: authUserId,
        communityId: memberInfo.communityId,
      },
      select: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!REQUIRED_ROLES.includes(authUserRole?.role.name || '')) {
      res.status(400).json(
        errorResponse({
          message: 'You are not authorized to perform this action.',
          code: 'NOT_ALLOWED_ACCESS',
        }),
      );
      return;
    }

    await prisma.member.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ status: true });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      res.status(400).json(
        errorResponse({
          message: 'Member not found.',
          code: 'RESOURCE_NOT_FOUND',
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

export { createMember, deleteMember };
