import { Router } from 'express';
import isAuth from '../middleware/auth';
import validateSchema from '../middleware/validware';
import { memberCreateSchema } from '../validators';
import { createMember, deleteMember } from '../controller/memberController';

const memberRouter = Router();
memberRouter.use(isAuth);

memberRouter.post('/', validateSchema(memberCreateSchema), createMember);
memberRouter.delete('/:id', deleteMember);

export default memberRouter;
