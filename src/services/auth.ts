import axios from '@/lib/axios';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  adminUsername: string;
  adminRole: string;
  token: string;
}

export const authService = {
  async adminLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axios.post('/auth/admin/login', credentials);
    return response.data;
  },

  async adminLogout(): Promise<void> {
    const token = localStorage.getItem('admin_token');
    if (token) {
      await axios.post('/auth/admin/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_role');
  },

  async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem('admin_token');
    if (!token) return false;

    try {
      await axios.get('/auth/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_role');
      return false;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  },

  getUsername(): string | null {
    return localStorage.getItem('admin_username');
  },

  getRole(): string | null {
    return localStorage.getItem('admin_role');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

export default authService;