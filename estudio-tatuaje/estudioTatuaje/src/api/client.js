// Cliente HTTP para la API del backend (Express + MongoDB)
// Gestiona el token JWT en localStorage y cierra sesión en 401.
const BASE_URL = '/api'
const TOKEN_KEY = 'estudio_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function request(path, options = {}) {
  const headers = { ...options.headers }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // Token inválido/expirado → limpiar sesión
  if (res.status === 401) {
    clearToken()
    window.dispatchEvent(new Event('auth:logout'))
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.message || `Error ${res.status}`)
  }
  return data
}

// Auth
export const login = (body) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify(body) })
export const register = (body) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify(body) })
export const getMe = () => request('/auth/me')

// Citas
export const getAppointments = (params = '') => request(`/appointments${params}`)
export const createAppointment = (body) =>
  request('/appointments', { method: 'POST', body: JSON.stringify(body) })
export const updateAppointmentStatus = (id, status) =>
  request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const deleteAppointment = (id) =>
  request(`/appointments/${id}`, { method: 'DELETE' })

// Contacto
export const sendMessage = (body) =>
  request('/contact', { method: 'POST', body: JSON.stringify(body) })
export const getMessages = () => request('/contact')
export const markMessageRead = (id) =>
  request(`/contact/${id}/read`, { method: 'PATCH' })
export const deleteMessage = (id) => request(`/contact/${id}`, { method: 'DELETE' })

// Galería
export const getGallery = () => request('/gallery')
export const createGalleryItem = (body) =>
  request('/gallery', { method: 'POST', body: JSON.stringify(body) })
export const deleteGalleryItem = (id) => request(`/gallery/${id}`, { method: 'DELETE' })
// Subida de fichero vía form-data → Cloudinary
export const uploadGalleryImage = ({ file, title, category }) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', title)
  formData.append('category', category)
  return request('/gallery/upload', { method: 'POST', body: formData })
}

// Clientes y ventas (admin)
export const getClients = () => request('/clients')
export const getClientDetail = (id) => request(`/clients/${id}`)
export const getSales = (params = '') => request(`/sales${params}`)
export const getSalesSummary = () => request('/sales/summary')
