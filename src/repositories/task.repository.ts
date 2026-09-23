import { PrismaClient } from '@prisma/client';
import { TaskModel } from '../models/task.model';



const prisma = new PrismaClient();

export class TaskRepository {
  // إنشاء مهمة جديدة مرتبطة بمستخدم معين
  static async createTask(title: string, description: string | null, userId: number): Promise<TaskModel> {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });
    return TaskModel.fromPrisma(task) as TaskModel;
  }

  // جلب كافة المهام
  static async findAllTasks(): Promise<TaskModel[]> {
    const tasks = await prisma.task.findMany();
    return tasks.map((task) => TaskModel.fromPrisma(task) as TaskModel);
  }

  // جلب مهام مستخدم معين بالـ userId
  static async findTasksByUserId(userId: number): Promise<TaskModel[]> {
    const tasks = await prisma.task.findMany({
      where: { userId },
    });
    return tasks.map((task) => TaskModel.fromPrisma(task) as TaskModel);
  }

  // البحث عن مهمة بمعرفها الـ id
  static async findTaskById(id: number): Promise<TaskModel | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });
    return TaskModel.fromPrisma(task);
  }
}