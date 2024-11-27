import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    /* TODO: Get from local storage after implement autentication */
    'X-Tenant': '',
    Authorization: '',
  },
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response)
)

export default axiosInstance
