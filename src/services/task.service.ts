import { TaskRepository } from '../repositories/task.repository';
import { TaskModel } from '../models/task.model';

export class TaskService {
  static async createTask(title: string, description: string | null, userId: number): Promise<TaskModel> {
    return await TaskRepository.createTask(title, description, userId);
  }

  static async getAllTasks(): Promise<TaskModel[]> {
    return await TaskRepository.findAllTasks();
  }

  static async getUserTasks(userId: number): Promise<TaskModel[]> {
    return await TaskRepository.findTasksByUserId(userId);
  }

  static async getTaskById(id: number): Promise<TaskModel | null> {
    return await TaskRepository.findTaskById(id);
  }
}