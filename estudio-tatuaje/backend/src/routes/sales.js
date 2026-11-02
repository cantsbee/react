import { Router } from 'express'
import Sale from '../models/Sale.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// Solo admin
router.use(requireAuth, requireRole('admin'))

// GET /api/sales — listar ventas (?client=id para filtrar)
router.get('/', async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.client) filter.client = req.query.client
    const sales = await Sale.find(filter)
      .populate('client', 'name email')
      .populate('appointment', 'date status')
      .sort({ date: -1 })
    res.json(sales)
  } catch (err) {
    next(err)
  }
})

// POST /api/sales
router.post('/', async (req, res, next) => {
  try {
    const { client, appointment, concept, amount, date, paymentMethod } = req.body
    if (!client || !concept || amount == null || !date) {
      return res.status(400).json({ message: 'Faltan campos: client, concept, amount, date' })
    }
    const sale = await Sale.create({ client, appointment, concept, amount, date, paymentMethod })
    await sale.populate('client', 'name email')
    res.status(201).json(sale)
  } catch (err) {
    next(err)
  }
})

// GET /api/sales/summary — totales por método de pago (dashboard admin)
router.get('/summary', async (req, res, next) => {
  try {
    const summary = await Sale.aggregate([
      { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ])
    const totalRevenue = summary.reduce((acc, s) => acc + s.total, 0)
    res.json({ totalRevenue, byMethod: summary })
  } catch (err) {
    next(err)
  }
})

export default router
