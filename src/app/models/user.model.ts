export interface User {
  id: string;
  userName: string;
  email: string;
  roles: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: User;
}
