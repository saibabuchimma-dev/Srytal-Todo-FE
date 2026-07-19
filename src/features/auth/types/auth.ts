export type UserRole = 'Admin' | 'Employee';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  token?: string;
  mustChangePassword: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      role: UserRole;
      avatar?: string;
      mustChangePassword: boolean;
    };
  };
}
