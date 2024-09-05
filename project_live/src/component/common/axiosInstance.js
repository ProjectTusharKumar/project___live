import axios from 'axios';
// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your API base URL
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Add any headers or other configurations here
    // For example, adding an Authorization token
    const token = localStorage.getItem('token');
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
