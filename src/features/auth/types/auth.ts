export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  token?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}
