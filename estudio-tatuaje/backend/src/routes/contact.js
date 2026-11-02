import { Router } from 'express'
import Contact from '../models/Contact.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// GET /api/contact — listar mensajes (solo admin)
router.get('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch (err) {
    next(err)
  }
})

// POST /api/contact — enviar mensaje de contacto (público)
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: name, email, message' })
    }
    const contact = await Contact.create({ name, email, message })
    res.status(201).json(contact)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/contact/:id/read — marcar como leído (solo admin)
router.patch('/:id/read', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { returnDocument: 'after' })
    if (!contact) return res.status(404).json({ message: 'Mensaje no encontrado' })
    res.json(contact)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/contact/:id — solo admin
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) return res.status(404).json({ message: 'Mensaje no encontrado' })
    res.json({ message: 'Mensaje eliminado' })
  } catch (err) {
    next(err)
  }
})

export default router
