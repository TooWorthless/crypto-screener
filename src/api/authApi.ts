import { axiosInstance } from './axiosInstance';
import { Tokens, User } from '../auth/types';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  userId: string;
}

interface CheckUserResponse {
  user: User | null;
}

interface RegisterBackendResponse {
  user: User;
}

export const authApi = {
  checkUser: (email: string) =>
    axiosInstance.get<CheckUserResponse>('/auth/check-user', { params: { email } }),

  registerWithBackend: (data: {
    username: string;
    email: string;
    authType: 'google' | 'credentials';
    password?: string;
  }) => axiosInstance.post<RegisterBackendResponse>('/auth/register-backend', data),

  loginWithCredentials: (username: string, password: string) =>
    axiosInstance.post<LoginResponse>('/auth/login', { username, password }),

  registerWithCredentials: (username: string, email: string, password: string) =>
    axiosInstance.post<RegisterResponse>('/auth/register', { username, email, password }),

  verifyEmail: (userId: string, code: string) =>
    axiosInstance.post<LoginResponse>('/auth/verify', { userId, code }),

  loginWithGoogle: (userData: { email: string; name: string }) => 
    axiosInstance.post<LoginResponse>('/auth/google', { userData }),

  refreshToken: (refreshToken: string) =>
    axiosInstance.post<Tokens>('/auth/refresh', { refreshToken }),
};