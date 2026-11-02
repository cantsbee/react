import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'estudio-girasol-secret-change-me'

// Verifica el token JWT y adjunta el usuario a la petición
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' })

    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.sub)
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' })

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

// Requiere uno de los roles indicados (usar después de requireAuth)
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para esta acción' })
    }
    next()
  }
}

export function signToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}
