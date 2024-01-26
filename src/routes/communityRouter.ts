import { Router } from 'express';
import isAuth from '../middleware/auth';
import validateSchema from '../middleware/validware';
import { communityCreateSchema } from '../validators';
import {
  createCommunity,
  getAllCommunity,
  getAllMembers,
  getJoinedCommunity,
  getOwnerCommunity,
} from '../controller/communityController';

const communityRouter = Router();

communityRouter.get('/', getAllCommunity);
communityRouter.get('/:id/members', getAllMembers);
communityRouter.get('/me/owner', isAuth, getOwnerCommunity);
communityRouter.get('/me/member', isAuth, getJoinedCommunity);
communityRouter.post('/', validateSchema(communityCreateSchema), createCommunity);

export default communityRouter;
