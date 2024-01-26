import { Router } from 'express';
import isAuth from '../middleware/auth';
import validateSchema from '../middleware/validware';
import { signInSchema, signUpSchema } from '../validators';
import { createUser, getSelf, loginUser } from '../controller/userAuthController';

const userRouter = Router();

userRouter.get('/me', isAuth, getSelf);
userRouter.post('/signin', validateSchema(signInSchema), loginUser);
userRouter.post('/signup', validateSchema(signUpSchema), createUser);

export default userRouter;
