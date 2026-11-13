import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    service = new TasksService();
  });

  it('starts with an empty task list', () => {
    expect(service.findAll()).toEqual([]);
  });

  it('generates unique IDs and defaults new tasks to TODO', () => {
    const before = Date.now();
    const first = service.create({ title: 'First task' });
    const second = service.create({ title: 'Second task' });

    expect(first.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(second.id).not.toBe(first.id);
    expect(first.status).toBe(TaskStatus.TODO);
    expect(first.createdAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(first.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    expect(service.findAll()).toEqual([first, second]);
  });

  it('stores and retrieves all supplied task fields', () => {
    const fields = {
      title: 'Build API',
      description: 'Implement task endpoints',
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2026-11-20',
    };
    const task = service.create(fields);

    expect(service.findOne(task.id)).toMatchObject(fields);
  });

  it('updates supplied fields and preserves omitted fields and metadata', () => {
    const task = service.create({
      title: 'Original title',
      description: 'Original description',
      dueDate: '2026-11-20',
    });
    const original = { ...task };

    const updated = service.update(task.id, {
      title: undefined,
      status: TaskStatus.DONE,
    });

    expect(updated).toEqual({ ...original, status: TaskStatus.DONE });
    expect(service.findOne(task.id)).toEqual(updated);
  });

  it('updates every editable field', () => {
    const task = service.create({ title: 'Original title' });
    const changes = {
      title: 'Updated title',
      description: '',
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2026-12-01',
    };

    expect(service.update(task.id, changes)).toMatchObject(changes);
  });

  it('leaves a task unchanged for an empty update', () => {
    const task = service.create({ title: 'Keep this task' });
    const original = { ...task };

    expect(service.update(task.id, {})).toEqual(original);
  });

  it('deletes only the requested task', () => {
    const first = service.create({ title: 'Delete this task' });
    const second = service.create({ title: 'Keep this task' });

    service.remove(first.id);

    expect(service.findAll()).toEqual([second]);
    expect(() => service.findOne(first.id)).toThrow(NotFoundException);
    expect(() => service.remove(first.id)).toThrow(NotFoundException);
  });

  it('returns 404 errors when finding, updating, or deleting a missing task', () => {
    const operations = [
      () => service.findOne('missing'),
      () => service.update('missing', { title: 'Updated title' }),
      () => service.remove('missing'),
    ];

    for (const operation of operations) {
      expect(operation).toThrow(NotFoundException);
      try {
        operation();
      } catch (error) {
        expect((error as NotFoundException).getStatus()).toBe(404);
      }
    }
    expect(service.findAll()).toEqual([]);
  });
});
