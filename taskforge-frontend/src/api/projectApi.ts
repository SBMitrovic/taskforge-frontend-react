import axios from 'axios'

const projectApi = axios.create({
  baseURL: 'http://localhost:1112',
  headers: {
    'Content-Type': 'application/json',
  },
})

projectApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default projectApi