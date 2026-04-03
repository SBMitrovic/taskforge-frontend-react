import axios from 'axios'

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default authApi