import {
  filterTasks,
  getPaginatedTasks,
  getTaskStats,
} from '@/features/task/utils/task.utils';
import type { Task } from '@/features/task/types/task';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: overrides.id ?? 't1',
  title: overrides.title ?? 'Title',
  description: overrides.description ?? 'Description',
  status: overrides.status ?? 'Pending',
  priority: overrides.priority ?? 'Medium',
  dueDate: overrides.dueDate ?? '2026-01-10',
  createdAt: overrides.createdAt ?? '2026-01-01',
  ...overrides,
});

const tasks: Task[] = [
  makeTask({ id: 'a', title: 'Alpha', description: 'first', status: 'Pending', priority: 'High', createdAt: '2026-01-01', dueDate: '2026-02-01' }),
  makeTask({ id: 'b', title: 'Beta', description: 'second', status: 'In Progress', priority: 'Low', createdAt: '2026-01-05', dueDate: '2026-01-15' }),
  makeTask({ id: 'c', title: 'Gamma', description: 'third', status: 'Completed', priority: 'Medium', createdAt: '2026-01-03', dueDate: '2026-03-01' }),
];

describe('getTaskStats', () => {
  it('counts tasks by status and total', () => {
    expect(getTaskStats(tasks)).toEqual({ pending: 1, inProgress: 1, completed: 1, total: 3 });
  });

  it('returns zeros for an empty list', () => {
    expect(getTaskStats([])).toEqual({ pending: 0, inProgress: 0, completed: 0, total: 0 });
  });
});

describe('filterTasks', () => {
  const base = { tasks, search: '', status: 'All' as const, priority: 'All' as const, sort: 'Newest' as const };

  it('sorts Newest first by createdAt (default branch)', () => {
    const result = filterTasks(base);
    expect(result.map((t) => t.id)).toEqual(['b', 'c', 'a']);
  });

  it('sorts Oldest first by createdAt', () => {
    const result = filterTasks({ ...base, sort: 'Oldest' });
    expect(result.map((t) => t.id)).toEqual(['a', 'c', 'b']);
  });

  it('sorts by Due Date ascending', () => {
    const result = filterTasks({ ...base, sort: 'Due Date' });
    expect(result.map((t) => t.id)).toEqual(['b', 'a', 'c']);
  });

  it('filters by search across title and description (case-insensitive)', () => {
    expect(filterTasks({ ...base, search: 'ALPHA' }).map((t) => t.id)).toEqual(['a']);
    expect(filterTasks({ ...base, search: 'second' }).map((t) => t.id)).toEqual(['b']);
  });

  it('filters by status', () => {
    expect(filterTasks({ ...base, status: 'Completed' }).map((t) => t.id)).toEqual(['c']);
  });

  it('filters by priority', () => {
    expect(filterTasks({ ...base, priority: 'High' }).map((t) => t.id)).toEqual(['a']);
  });

  it('combines filters, yielding empty when nothing matches', () => {
    expect(filterTasks({ ...base, status: 'Pending', priority: 'Low' })).toHaveLength(0);
  });
});

describe('getPaginatedTasks', () => {
  it('slices to the requested page/size', () => {
    expect(getPaginatedTasks(tasks, 1, 2).map((t) => t.id)).toEqual(['a', 'b']);
    expect(getPaginatedTasks(tasks, 2, 2).map((t) => t.id)).toEqual(['c']);
    expect(getPaginatedTasks(tasks, 3, 2)).toEqual([]);
  });
});
