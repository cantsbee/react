import { Router } from 'express'
import User from '../models/User.js'
import { requireAuth, signToken } from '../middleware/auth.js'

const router = Router()

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role }
}

// POST /api/auth/register — alta de usuario con rol 'client'
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos: name, email, password' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }
    const exists = await User.findOne({ email: String(email).toLowerCase() })
    if (exists) return res.status(409).json({ message: 'Ya existe un usuario con ese email' })

    // El rol siempre es 'client' en el registro público (el admin se crea por seed)
    const user = await User.create({ name, email, password, role: 'client' })
    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan campos: email, password' })
    }
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' })
    }
    res.json({ token: signToken(user), user: publicUser(user) })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me — perfil del usuario logueado
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) })
})

export default router
