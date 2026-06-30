import { create } from 'zustand';
import type { Employee } from '../types/employee';

interface EmployeeStore {
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  selectedEmployee: null,

  setSelectedEmployee: (employee) =>
    set({
      selectedEmployee: employee,
    }),
}));
