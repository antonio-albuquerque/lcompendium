import client from "./client";
import type { User, Token, LoginRequest, RegisterRequest } from "../types/auth";

export async function register(data: RegisterRequest): Promise<User> {
  const response = await client.post<User>("/auth/register", data);
  return response.data;
}

export async function login(data: LoginRequest): Promise<Token> {
  const params = new URLSearchParams();
  params.append("username", data.username);
  params.append("password", data.password);
  const response = await client.post<Token>("/auth/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
}

export async function fetchMe(): Promise<User> {
  const response = await client.get<User>("/auth/me");
  return response.data;
}
