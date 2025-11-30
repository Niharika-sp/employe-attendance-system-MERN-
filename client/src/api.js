import axios from 'axios'

const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api'

export const api = axios.create({ baseURL: base })

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}
