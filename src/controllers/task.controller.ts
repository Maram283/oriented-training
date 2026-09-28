import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { TaskService } from '../services/task.service';
import { HTTP_STATUS } from '../utils/status-codes';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { CreateTaskDto } from '../dtos/task.dto';

class TaskController extends BaseController {
  public createTask = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new CreateTaskDto(req.body);
    const userId = req.user?.userId; 

    if (!userId) {
      throw new AppError('Unauthorized user', HTTP_STATUS.UNAUTHORIZED);
    }

    const newTask = await TaskService.createTask(dto.title, dto.description || '', userId);
    this.sendResponse(res, HTTP_STATUS.CREATED, newTask, 'Task created successfully');
  });

  public getAllTasks = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const tasks = await TaskService.getAllTasks();
    this.sendResponse(res, HTTP_STATUS.OK, tasks, 'Tasks retrieved successfully');
  });

  public getUserTasks = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new AppError('Unauthorized user', HTTP_STATUS.UNAUTHORIZED);
    }

    const tasks = await TaskService.getUserTasks(userId);
    this.sendResponse(res, HTTP_STATUS.OK, tasks, 'User tasks retrieved successfully');
  });
}

export const taskController = new TaskController();