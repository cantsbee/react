import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import appointmentRoutes from './routes/appointments.js'
import contactRoutes from './routes/contact.js'
import galleryRoutes from './routes/gallery.js'
import clientRoutes from './routes/clients.js'
import salesRoutes from './routes/sales.js'

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  })
)
app.use(express.json({ limit: '1mb' }))

// Rutas de la API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'estudio-tatuaje-api' })
})
app.use('/api/auth', authRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/sales', salesRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

// Manejador de errores centralizado
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Error del servidor' })
})

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API escuchando en http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('No se pudo conectar a MongoDB:', err.message)
    process.exit(1)
  })
