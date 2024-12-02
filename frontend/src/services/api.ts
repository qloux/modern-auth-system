import axios, { AxiosError } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Login error:', err.response?.data || err.message);
      throw err;
    }
  },

  register: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Register error:', err.response?.data || err.message);
      throw err;
    }
  },

  resetPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Reset password error:', err.response?.data || err.message);
      throw err;
    }
  },

  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Token verification error:', err.response?.data || err.message);
      return null;
    }
  },
};

export const tasksAPI = {
  getTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Get tasks error:', err.response?.data || err.message);
      throw err;
    }
  },

  createTask: async (taskData: any) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Create task error:', err.response?.data || err.message);
      throw err;
    }
  },

  updateTask: async (taskId: string, taskData: any) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Update task error:', err.response?.data || err.message);
      throw err;
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Delete task error:', err.response?.data || err.message);
      throw err;
    }
  },

  getAISuggestions: async () => {
    try {
      console.log('Fetching AI suggestions...');
      const response = await api.get('/tasks/ai-suggestions');
      console.log('AI suggestions response:', response.data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Get AI suggestions error:', err.response?.data || err.message);
      throw err;
    }
  },
};

export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Get profile error:', err.response?.data || err.message);
      throw err;
    }
  },

  updateProfile: async (updates: any) => {
    try {
      const response = await api.put('/users/profile', updates);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Update profile error:', err.response?.data || err.message);
      throw err;
    }
  },

  updatePassword: async (oldPassword: string, newPassword: string) => {
    try {
      const response = await api.put('/users/password', {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Password update error:', err.response?.data || err.message);
      throw err;
    }
  },

  deleteAccount: async () => {
    try {
      const response = await api.delete('/users/account');
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      console.error('Delete account error:', err.response?.data || err.message);
      throw err;
    }
  },
};

export default api;
