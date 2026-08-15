import axios from 'axios';

const API_URL = 'https://realestate.gayathiriportfolio.xyz/api';

export const api = {
  // Market Stats
  getMarketStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/market/stats`);
      return response.data;
    } catch (error) {
      console.error('Market stats error:', error);
      return { total_properties: 0, average_price: 0 };
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Predict
  predict: async (houseData) => {
    try {
      const params = new URLSearchParams(houseData).toString();
      const response = await axios.get(`${API_URL}/predict?${params}`);
      return response.data;
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  },

  // Properties
  getProperties: async () => {
    try {
      const response = await axios.get(`${API_URL}/properties`);
      return response.data;
    } catch (error) {
      console.error('Properties error:', error);
      return { properties: [] };
    }
  },

  // Users
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Users error:', error);
      return { users: [] };
    }
  }
};

export default api;