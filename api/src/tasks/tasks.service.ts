import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.interface';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  private readonly tasks = new Map<string, Task>();

  // Create and store a task with a generated ID, creation time, and default status.
  create(dto: CreateTaskDto): Task {
    const task: Task = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      status: dto.status ?? TaskStatus.TODO,
      dueDate: dto.dueDate,
      createdAt: new Date(),
    };

    this.tasks.set(task.id, task);
    return task;
  }

  // Return all tasks in the order they were created.
  findAll(): Task[] {
    return Array.from(this.tasks.values());
  }

  // Find a task by ID or throw a 404 error when it does not exist.
  findOne(id: string): Task {
    const task = this.tasks.get(id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  // Update only supplied editable fields while preserving the task ID and creation time.
  update(id: string, dto: UpdateTaskDto): Task {
    const task = this.findOne(id);

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.dueDate === null) delete task.dueDate;
    else if (dto.dueDate !== undefined) task.dueDate = dto.dueDate;

    return task;
  }

  // Delete an existing task or throw a 404 error when it does not exist.
  remove(id: string): void {
    this.findOne(id);
    this.tasks.delete(id);
  }
}
