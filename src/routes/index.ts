import { Router } from 'express';
import roleRouter from './roleRouter';
import userRouter from './userRouter';
import memberRouter from './memberRouter';
import communityRouter from './communityRouter';

const v1Router = Router();

v1Router.use('/role', roleRouter);
v1Router.use('/auth', userRouter);
v1Router.use('/member', memberRouter);
v1Router.use('/community', communityRouter);

export default v1Router;
