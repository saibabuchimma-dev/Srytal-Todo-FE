export interface Employee {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  designation: string;
  avatar: string;
  role?: string;
  isActive?: boolean;
}

export interface CreateEmployeePayload {
  fullName: string;
  email: string;
  role: 'Admin' | 'Employee';
  password: string;
  isActive?: boolean;
}
