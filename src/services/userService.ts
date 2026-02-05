import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { User } from '../types';

class UserService {
  private api: AxiosInstance;
  private baseURL = 'http://localhost:3001/users';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      const response = await this.api.post<User>('', user);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create user');
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.api.get<User[]>('');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch users');
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await this.api.get<User>(`/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch user');
    }
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    try {
      const response = await this.api.put<User>(`/${id}`, user);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error) {
      throw this.handleError(error, 'Failed to delete user');
    }
  }

  private handleError(error: unknown, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || defaultMessage;
      return new Error(message);
    }
    return new Error(defaultMessage);
  }
}

export default new UserService();
