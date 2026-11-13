import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { Task } from './entities/task.interface';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // LLM: Return every stored task.
  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  // LLM: Return a task by ID or respond with 404 when it is missing.
  @Get(':id')
  findOne(@Param('id') id: string): Task {
    return this.tasksService.findOne(id);
  }

  // LLM: Validate the request body and create a task with a 201 response.
  @Post()
  create(@Body() dto: CreateTaskDto): Task {
    return this.tasksService.create(dto);
  }

  // LLM: Validate supplied fields and update an existing task or respond with 404.
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Task {
    return this.tasksService.update(id, dto);
  }

  // LLM: Delete a task with a 204 response or respond with 404 when it is missing.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.tasksService.remove(id);
  }
}
