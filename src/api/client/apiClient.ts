import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const raw = sessionStorage.getItem('authToken')
  if (raw) {
    try {
      const { access_token } = JSON.parse(raw) as { access_token?: string }
      if (access_token) config.headers.Authorization = `Bearer ${access_token}`
    } catch {
      // token malformado — interceptor de respuesta lo manejará
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // AuthContext maneja el redirect a /login
    }
    console.error('API Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  },
)

export default apiClient
