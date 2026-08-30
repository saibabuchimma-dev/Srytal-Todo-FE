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
  refreshToken?: string;
  mustChangePassword: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    mustChangePassword: boolean;
    user: {
      id: string;
      fullName: string;
      email: string;
      role: UserRole;
      mustChangePassword: boolean;
    };
  };
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
