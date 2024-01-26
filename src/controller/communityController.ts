import prisma from '../utils/db';
import { ADMIN_ROLE_NAME } from '../Constants';
import type { Request, Response } from 'express';
import { Snowflake } from '@theinternetfolks/snowflake';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Logger, errorResponse, getPaginatedParameters, successResponse } from '../utils';

async function createCommunity(req: Request, res: Response) {
  const { name } = req.body;
  const authUserID = req.payload.userId;
  let slug = name.toLowerCase().replaceAll(' ', '-');

  try {
    const sameSlugCount = await prisma.community.count({
      where: {
        name,
      },
    });

    if (sameSlugCount) {
      slug = `${slug}-${sameSlugCount}`;
    }

    const communityId = Snowflake.generate();
    const { ownerId, ...data } = await prisma.community.create({
      data: {
        id: communityId,
        name,
        slug,
        ownerId: authUserID,
      },
    });

    const adminRoleId = (
      await prisma.role.findFirst({
        where: {
          name: ADMIN_ROLE_NAME,
        },
        select: {
          id: true,
        },
      })
    )?.id;

    if (!adminRoleId) {
      res.status(400).json(
        errorResponse({
          message: 'Admin role not found.',
          code: 'RESOURCE_NOT_FOUND',
        }),
      );
      return;
    }

    const memberId = Snowflake.generate();

    await prisma.member.create({
      data: {
        id: memberId,
        communityId,
        userId: authUserID,
        roleId: adminRoleId,
      },
    });
    res.status(200).json(successResponse({ ...data, owner: ownerId }));
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      // This should never be reached in the first place
      res.status(400).json(
        errorResponse({
          code: 'RESOURCE_EXISTS',
          message: 'Community with the slug exits already exists.',
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

const communityInfo = {
  id: true,
  name: true,
  slug: true,
  created_at: true,
  updated_at: true,
  owner: {
    select: {
      id: true,
      name: true,
    },
  },
};
async function getAllCommunity(req: Request, res: Response) {
  try {
    const total = await prisma.community.count();
    const { skip, take, totalPages, currentPage } = getPaginatedParameters(Number(req.query.page), total);

    const communities = await prisma.community.findMany({
      select: communityInfo,
      skip,
      take,
    });

    res.status(200).json(
      successResponse(communities, {
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

async function getAllMembers(req: Request, res: Response) {
  const LogicalORCondition = [
    {
      community: {
        id: req.params.id,
      },
    },
    {
      community: {
        slug: req.params.id,
      },
    },
  ];
  try {
    const total = await prisma.member.count({
      where: {
        OR: LogicalORCondition,
      },
    });
    const { skip, take, totalPages, currentPage } = getPaginatedParameters(Number(req.query.page), total);

    const members = await prisma.member.findMany({
      where: {
        OR: LogicalORCondition,
      },
      select: {
        id: true,
        communityId: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        created_at: true,
      },

      skip,
      take,
    });
    // TODO: Change the schema so that the community id is called `community` and remove this map
    const data = members.map(member => {
      const { communityId, ...data } = member;
      return { ...data, community: communityId };
    });
    res.status(200).json(
      successResponse(data, {
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

async function getJoinedCommunity(req: Request, res: Response) {
  const authUserID = req.payload.userId;
  const WhereCondition = {
    member: {
      some: {
        id: authUserID,
      },
    },
  };
  try {
    const total = await prisma.community.count({
      where: WhereCondition,
    });

    const { skip, take, totalPages, currentPage } = getPaginatedParameters(Number(req.query.page), total);

    const communities = await prisma.community.findMany({
      where: WhereCondition,
      select: communityInfo,
      skip,
      take,
    });

    res.status(200).json(
      successResponse(communities, {
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

async function getOwnerCommunity(req: Request, res: Response) {
  const authUserID = req.payload.userId;

  try {
    const total = await prisma.community.count({
      where: {
        ownerId: authUserID,
      },
    });

    const { skip, take, totalPages, currentPage } = getPaginatedParameters(Number(req.query.page), total);

    const communities = await prisma.community.findMany({
      where: {
        ownerId: authUserID,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        ownerId: true,
        created_at: true,
        updated_at: true,
      },
      skip,
      take,
    });

    // TODO: Change the schema so that the owner id is called `owner` and remove this map
    const data = communities.map(community => {
      const { ownerId, ...data } = community;
      return { ...data, owner: ownerId };
    });

    res.status(200).json(
      successResponse(data, {
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

export { createCommunity, getAllMembers, getAllCommunity, getOwnerCommunity, getJoinedCommunity };
