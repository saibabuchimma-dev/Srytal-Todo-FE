export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
  password: string;
  name: string;
  role: string;
}
