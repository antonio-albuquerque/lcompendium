export interface User {
  id: string;
  username: string;
  email: string;
  is_approved: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
