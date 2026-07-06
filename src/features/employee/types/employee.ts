export interface Employee {
  id: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Employee';
  avatar: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeePayload {
  fullName: string;
  email: string;
  role: 'Admin' | 'Employee';
  isActive?: boolean;
}

export interface UpdateEmployeePayload {
  fullName: string;
  email: string;
  role: 'Admin' | 'Employee';
  avatar?: string;
  isActive: boolean;
}
