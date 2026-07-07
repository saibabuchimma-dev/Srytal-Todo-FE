import { create } from 'zustand';

import type { Task } from '../types/task';

interface TaskStore {
  selectedTask: Task | null;
  setSelectedTask: (task: Task) => void;
  clearSelectedTask: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  selectedTask: null,
  setSelectedTask: (task) =>
    set({
      selectedTask: task,
    }),
  clearSelectedTask: () =>
    set({
      selectedTask: null,
    }),
}));
