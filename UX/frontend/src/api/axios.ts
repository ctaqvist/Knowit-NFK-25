import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})

// Map the response to the data
api.interceptors.response.use((response) => response.data);