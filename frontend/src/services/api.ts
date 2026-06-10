import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  registerUser: async (username: string, password: string, name: string) => {
    const response = await axios.post(`${API_BASE_URL}/users/register`, { username, password, name });
    return response.data;
  },
  loginUser: async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/users/login`, { username, password });
    return response.data;
  },
  getCategories: async () => {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  },
  createLesson: async (userId: number, categoryId: number, subCategoryId: number, prompt: string) => {
    const response = await axios.post(`${API_BASE_URL}/prompts`, { userId, categoryId, subCategoryId, prompt });
    return response.data;
  },
  getUserHistory: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/history`);
    return response.data;
  },
  getAdminDashboard: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/history`);
    return response.data;
  }
};