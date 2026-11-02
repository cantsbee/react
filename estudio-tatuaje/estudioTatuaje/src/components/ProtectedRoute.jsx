import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

// Protege rutas: exige sesión y, opcionalmente, un rol concreto.
// - Sin token → /login
// - Rol incorrecto → /
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <p style={{ padding: '3rem' }}>Cargando sesión…</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
