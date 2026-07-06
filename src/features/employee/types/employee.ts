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
