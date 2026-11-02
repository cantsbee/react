import { Router } from 'express'
import Appointment from '../models/Appointment.js'
import Client from '../models/Client.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// GET /api/appointments — listar citas
// admin: todas; client: solo las suyas (por email)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const filter = {}
    if (req.user.role !== 'admin') {
      const client = await Client.findOne({ email: req.user.email })
      filter.client = client ? client._id : null
    } else if (req.query.status) {
      filter.status = req.query.status
    }
    const appointments = await Appointment.find(filter)
      .populate('client', 'name email phone')
      .sort({ date: 1 })
    res.json(appointments)
  } catch (err) {
    next(err)
  }
})

// GET /api/appointments/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      'client',
      'name email phone'
    )
    if (!appointment) return res.status(404).json({ message: 'Cita no encontrada' })
    // Un client solo puede ver sus propias citas
    if (
      req.user.role !== 'admin' &&
      String(appointment.client?._id) !== String(req.user._id) &&
      appointment.client?.email !== req.user.email
    ) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta cita' })
    }
    res.json(appointment)
  } catch (err) {
    next(err)
  }
})

// POST /api/appointments — solicitud pública: crea o reutiliza el cliente por email
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, date, idea, bodyPart } = req.body
    if (!name || !email || !date || !idea) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: name, email, date, idea' })
    }
    const normalizedEmail = String(email).toLowerCase()
    let client = await Client.findOne({ email: normalizedEmail })
    if (!client) {
      client = await Client.create({ name, email: normalizedEmail, phone })
    }
    const appointment = await Appointment.create({ client: client._id, date, idea, bodyPart })
    await appointment.populate('client', 'name email phone')
    res.status(201).json(appointment)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/appointments/:id/status — cambiar estado (solo admin)
router.patch('/:id/status', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { status } = req.body
    if (!['pendiente', 'confirmada', 'cancelada'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' })
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after', runValidators: true }
    ).populate('client', 'name email phone')
    if (!appointment) return res.status(404).json({ message: 'Cita no encontrada' })
    res.json(appointment)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/appointments/:id — solo admin
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)
    if (!appointment) return res.status(404).json({ message: 'Cita no encontrada' })
    res.json({ message: 'Cita eliminada' })
  } catch (err) {
    next(err)
  }
})

export default router
