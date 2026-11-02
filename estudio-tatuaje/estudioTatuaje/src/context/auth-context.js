import { createContext } from 'react'

// Contexto puro de autenticación (sin componentes → no afecta a react-refresh)
export const AuthContext = createContext(null)
