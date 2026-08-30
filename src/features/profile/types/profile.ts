export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  avatar?: string;
}
