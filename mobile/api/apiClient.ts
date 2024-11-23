import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define a generic API response type
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
}

// Create an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.3:8080', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: any) => {
    // Add custom logic, e.g., attach authentication tokens
    console.log('Request:', config);
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
    console.log('Response:', response);
    return response.data; // Return only the data portion
  },
  (error) => {
    console.error('Response Error:', error.response || error.message);
    return Promise.reject(error); 
  }
);

export default apiClient;
