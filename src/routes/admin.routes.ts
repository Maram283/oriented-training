import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { taskController } from '../controllers/task.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrator restricted endpoints
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not an admin)
 */
router.get('/users', userController.getAllUsers);

/**
 * @swagger
 * /api/admin/tasks:
 *   get:
 *     summary: Get all tasks (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not an admin)
 */
router.get('/tasks', taskController.getAllTasks);

export default router;
