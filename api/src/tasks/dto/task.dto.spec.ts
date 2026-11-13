import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { TaskStatus } from '../task-status.enum';

describe('Task DTO validation', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  function validate(
    body: Record<string, unknown>,
    metatype: typeof CreateTaskDto | typeof UpdateTaskDto = CreateTaskDto,
  ): Promise<unknown> {
    return pipe.transform(body, { type: 'body', metatype });
  }

  it('accepts a title alone and trims surrounding whitespace', async () => {
    await expect(validate({ title: '  Write README  ' })).resolves.toEqual({
      title: 'Write README',
    });
  });

  it('accepts all supported fields', async () => {
    const body = {
      title: 'Build API',
      description: 'Implement task endpoints',
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2026-11-20',
    };
    await expect(validate(body)).resolves.toEqual(body);
  });

  it.each([undefined, null, '', '   ', 42])(
    'rejects an invalid create title: %p',
    async (title) => {
      await expect(validate({ title })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );

  it.each([
    { status: 'INVALID' },
    { status: null },
    { description: 42 },
    { description: null },
    { dueDate: 'tomorrow' },
    { dueDate: '2026-02-30' },
    { id: 'client-supplied-id' },
    { createdAt: '2026-11-13' },
  ])('rejects invalid fields on create and update: %p', async (fields) => {
    await expect(validate({ title: 'Task', ...fields })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(validate(fields, UpdateTaskDto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('accepts a partial update without requiring a title', async () => {
    await expect(
      validate({ status: TaskStatus.DONE }, UpdateTaskDto),
    ).resolves.toEqual({ status: TaskStatus.DONE });
  });

  it('accepts null to clear a due date on update but not on create', async () => {
    await expect(validate({ dueDate: null }, UpdateTaskDto)).resolves.toEqual({
      dueDate: null,
    });
    await expect(
      validate({ title: 'Task', dueDate: null }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('accepts an empty update', async () => {
    await expect(validate({}, UpdateTaskDto)).resolves.toEqual({});
  });

  it.each([null, '', '   ', 42])(
    'rejects an invalid title when updating: %p',
    async (title) => {
      await expect(validate({ title }, UpdateTaskDto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    },
  );
});
