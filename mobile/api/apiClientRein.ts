import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ip } from './ip';

// Define a generic API response type
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
}

// Create an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${ip}:8000`, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: any) => {
    // Add custom logic, e.g., attach authentication tokens
    return config; // Must return AxiosRequestConfig
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

    return response; // Return only the data portion
  },
  (error) => {
    console.error('Response Error:', error.response || error.message);
    return Promise.reject(error); 
  }
);

export default apiClient;
