import axios from 'axios';

// Ensure Backend URL is provided
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
if (!BACKEND_URL) {
  throw new Error(`Missing backend URL variable in env!`)
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})

// Map the response to the data
api.interceptors.response.use((response) => response.data);