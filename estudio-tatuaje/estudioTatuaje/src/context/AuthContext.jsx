import { useEffect, useState } from 'react'
import * as api from '../api/client.js'
import { AuthContext } from './auth-context.js'

export function AuthProvider({ children }) {
  // Si no hay token guardado, no hay nada que restaurar → loading arranca en false
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => !api.getToken())

  // Restaurar sesión desde el token guardado
  useEffect(() => {
    if (!api.getToken()) return
    let cancelled = false
    api
      .getMe()
      .then((data) => {
        if (!cancelled) setUser(data.user)
      })
      .catch(() => api.clearToken())
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Cierre de sesión cuando el backend responde 401
  useEffect(() => {
    const onLogout = () => setUser(null)
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  async function login(email, password) {
    const data = await api.login({ email, password })
    api.setToken(data.token)
    setUser(data.user)
    return data.user
  }

  async function register(name, email, password) {
    const data = await api.register({ name, email, password })
    api.setToken(data.token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    api.clearToken()
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
