import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

class AuthService {
  private static TOKEN_KEY = 'auth_token';
  private static USER_KEY = 'user_data';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      this.setToken(response.data.token);
      this.setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, credentials);
      this.setToken(response.data.token);
      this.setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    localStorage.removeItem(AuthService.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  getUser(): any | null {
    const user = localStorage.getItem(AuthService.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
  }

  private handleError(error: any): Error {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred during authentication');
    }
    throw new Error('Network error occurred');
  }
}

export const authService = new AuthService(); 