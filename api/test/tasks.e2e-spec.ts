import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/configure-app';
import { Task } from '../src/tasks/entities/task.interface';
import { TaskStatus } from '../src/tasks/task-status.enum';

type TaskResponse = Omit<Task, 'createdAt'> & { createdAt: string };

describe('Tasks API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  async function createTask(
    body: Record<string, unknown> = { title: 'Test task' },
  ): Promise<TaskResponse> {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send(body)
      .expect(201);
    return response.body as TaskResponse;
  }

  it('returns an empty list before tasks are created', async () => {
    await request(app.getHttpServer()).get('/tasks').expect(200).expect([]);
  });

  it('supports the full create, list, find, update, and delete lifecycle', async () => {
    const created = await createTask({ title: '  Build task API  ' });
    expect(created).toEqual({
      id: expect.any(String) as string,
      title: 'Build task API',
      status: TaskStatus.TODO,
      createdAt: expect.any(String) as string,
    });
    expect(Number.isNaN(Date.parse(created.createdAt))).toBe(false);

    await request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect([created]);
    await request(app.getHttpServer())
      .get(`/tasks/${created.id}`)
      .expect(200)
      .expect(created);

    const changes = {
      title: 'Finish task API',
      description: 'Add HTTP tests',
      status: TaskStatus.DONE,
      dueDate: '2026-12-01',
    };
    const updated = { ...created, ...changes };
    await request(app.getHttpServer())
      .patch(`/tasks/${created.id}`)
      .send(changes)
      .expect(200)
      .expect(updated);
    await request(app.getHttpServer())
      .get(`/tasks/${created.id}`)
      .expect(200)
      .expect(updated);

    const deleted = await request(app.getHttpServer())
      .delete(`/tasks/${created.id}`)
      .expect(204);
    expect(deleted.text).toBe('');
    await request(app.getHttpServer()).get('/tasks').expect(200).expect([]);
    await request(app.getHttpServer()).get(`/tasks/${created.id}`).expect(404);
  });

  it('accepts all optional fields on creation and preserves omitted fields on update', async () => {
    const created = await createTask({
      title: 'Task',
      description: 'Keep description',
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2026-12-01',
    });
    expect(created).toMatchObject({
      description: 'Keep description',
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2026-12-01',
    });
    await request(app.getHttpServer())
      .patch(`/tasks/${created.id}`)
      .send({ status: TaskStatus.DONE })
      .expect(200)
      .expect({ ...created, status: TaskStatus.DONE });
  });

  it.each([
    {},
    { title: '' },
    { title: '   ' },
    { title: 123 },
    { title: null },
    { title: 'Task', status: 'INVALID' },
    { title: 'Task', description: 123 },
    { title: 'Task', dueDate: '2026-02-30' },
    { title: 'Task', id: 'client-generated' },
    { title: 'Task', createdAt: '2026-11-13' },
  ])('returns 400 for invalid creation input: %p', async (body) => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send(body)
      .expect(400);
    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
      message: expect.any(Array) as string[],
    });
    await request(app.getHttpServer()).get('/tasks').expect(200).expect([]);
  });

  it.each([
    { title: '   ' },
    { status: 'INVALID' },
    { status: null },
    { dueDate: 'tomorrow' },
    { id: 'replacement-id' },
    { createdAt: '2026-11-13' },
  ])(
    'returns 400 without changing a task for invalid updates: %p',
    async (body) => {
      const created = await createTask();
      await request(app.getHttpServer())
        .patch(`/tasks/${created.id}`)
        .send(body)
        .expect(400);
      await request(app.getHttpServer())
        .get(`/tasks/${created.id}`)
        .expect(200)
        .expect(created);
    },
  );

  it.each(['get', 'patch', 'delete'] as const)(
    'returns 404 for %s requests for a missing task',
    async (method) => {
      const call = request(app.getHttpServer())[method]('/tasks/missing');
      if (method === 'patch') call.send({ title: 'Updated' });
      const response = await call.expect(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        error: 'Not Found',
        message: 'Task with ID "missing" not found',
      });
    },
  );

  it('clears an existing due date without changing other task fields', async () => {
    const created = await createTask({
      title: 'Task with a due date',
      dueDate: '2026-12-01',
    });
    const expected = { ...created };
    delete expected.dueDate;
    await request(app.getHttpServer())
      .patch(`/tasks/${created.id}`)
      .send({ dueDate: null })
      .expect(200)
      .expect(expected);
    await request(app.getHttpServer())
      .get(`/tasks/${created.id}`)
      .expect(200)
      .expect(expected);
  });

  it('returns 400 for malformed JSON', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send('{"title":')
      .expect(400);
  });
});
