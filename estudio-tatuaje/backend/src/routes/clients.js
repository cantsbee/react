import { Router } from 'express'
import Client from '../models/Client.js'
import Appointment from '../models/Appointment.js'
import Sale from '../models/Sale.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// Todas las rutas de clientes requieren rol admin
router.use(requireAuth, requireRole('admin'))

// GET /api/clients — listar clientes
router.get('/', async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ name: 1 })
    res.json(clients)
  } catch (err) {
    next(err)
  }
})

// POST /api/clients
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, city } = req.body
    if (!name || !email) {
      return res.status(400).json({ message: 'Faltan campos: name, email' })
    }
    const client = await Client.create({ name, email, phone, city })
    res.status(201).json(client)
  } catch (err) {
    next(err)
  }
})

// GET /api/clients/:id — cliente con sus citas y ventas
router.get('/:id', async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id)
    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' })
    const [appointments, sales] = await Promise.all([
      Appointment.find({ client: client._id }).sort({ date: 1 }),
      Sale.find({ client: client._id }).sort({ date: -1 }),
    ])
    res.json({ client, appointments, sales })
  } catch (err) {
    next(err)
  }
})

export default router
