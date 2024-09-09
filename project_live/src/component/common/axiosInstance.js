import axios from 'axios';
import { LOGIN_AUTH_TOKEN_KEY } from './EnumValues';
// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Add any headers or other configurations here
    // For example, adding an Authorization token
    const token = localStorage.getItem(LOGIN_AUTH_TOKEN_KEY);
    if (token) {
      config.headers['x-access-token'] = `Bearer ${token}`; //Bearer 
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    // Handle successful responses
    return response;
  },
  error => {
    // Handle errors
    // For example, you can handle unauthorized access globally
    if (error.response && error.response.status === 401) {
      // Redirect to login or handle unauthorized access
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
