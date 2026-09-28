import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/current', userController.getCurrentUser);
router.get('/:id', userController.getUserById);

export default router;
