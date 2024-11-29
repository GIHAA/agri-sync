import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ip } from './ip';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore to retrieve token

// Define a generic API response type
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
}

// Create an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${ip}:3003`, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config: any) => {
    // Retrieve the token from SecureStore (or other storage)
    const token = await SecureStore.getItemAsync('auth_token'); 

    if (token) {
      // Add the token to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.log("No token found");
    }

    console.log('Request:', config); // Log the request details
    return config; // Return the modified config
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error); // Pass the error to the next handler
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse['data'] => {
    // Handle and return the actual data from the response
    console.log('Response:', response);
    return response.data; // Return only the data portion
  },
  (error) => {
    console.error('Response Error:', error.response || error.message);
    return Promise.reject(error); 
  }
);

export default apiClient;
