import { Router } from 'express';
import { roleCreateSchema } from '../validators';
import validateSchema from '../middleware/validware';
import { createRole, getAllRoles } from '../controller/roleController';

const roleRouter = Router();

roleRouter.get('/', getAllRoles);
roleRouter.post('/', validateSchema(roleCreateSchema), createRole);

export default roleRouter;
