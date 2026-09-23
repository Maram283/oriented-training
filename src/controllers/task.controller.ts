import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';

export class TaskController {
  // إنشاء مهمة جديدة
  static async createTask(req: Request, res: Response) {
    try {
      const { title, description } = req.body;
      // استخراج userId من الـ Token المفلتر عبر الـ Auth Middleware
      const userId = (req as any).user?.userId || (req as any).user?.id || req.body.userId;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User ID is missing' });
      }

      const task = await TaskService.createTask(title, description || null, userId);
      return res.status(201).json({ message: 'Task created successfully', task });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // جلب كافة المهام (للعرض العام أو الأدمن)
  static async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await TaskService.getAllTasks();
      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // جلب مهام المستخدم الحالي
  static async getUserTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: User ID is missing' });
      }

      const tasks = await TaskService.getUserTasks(userId);
      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}