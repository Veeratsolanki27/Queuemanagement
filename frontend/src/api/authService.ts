import apiClient from './client';
import type { User } from '../types';

export const authApi = {
  login: async (username: string, password: string): Promise<User> => {
    const response = await apiClient.post('/auth/login', { username, password });
    const { token, id, fullName, role } = response.data;
    const user: User = { id, username, fullName, role, token };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  register: async (username: string, password: string, fullName: string): Promise<User> => {
    const response = await apiClient.post('/auth/register', { username, password, fullName });
    const { token, id, role } = response.data;
    const user: User = { id, username, fullName, role, token };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },
};

