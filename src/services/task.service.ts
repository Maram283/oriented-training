import { TaskRepository } from '../repositories/task.repository';

export class TaskService {
  static async createTask(title: string, description: string | null, userId: number) {
    return await TaskRepository.createTask(title, description, userId);
  }

  static async getAllTasks() {
    return await TaskRepository.findAllTasks();
  }

  static async getUserTasks(userId: number) {
    return await TaskRepository.findTasksByUserId(userId);
  }

  static async getTaskById(id: number) {
    return await TaskRepository.findTaskById(id);
  }
}