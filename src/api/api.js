import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Set your computer's local IP address here instead of localhost
// because Android Emulator needs to reach your PC
const API_URL = 'http://192.168.1.174:3000/api'; 

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor: Attach JWT Token securely
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error fetching token from SecureStore', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
