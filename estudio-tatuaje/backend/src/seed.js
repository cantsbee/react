import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import GalleryItem from './models/GalleryItem.js'

// Datos de ejemplo: copia las imágenes de src/components a backend/public/
// o usa URLs externas. Se ejecuta con: npm run seed
const items = [
  { title: 'mujer', category: 'grabado', url: '/images/mujer.png', order: 1 },
  { title: 'cuervo', category: 'grabado', url: '/images/cuervo.png', order: 2 },
]

try {
  await connectDB()
  await GalleryItem.deleteMany({})
  await GalleryItem.insertMany(items)
  console.log(`Seed completado: ${items.length} imágenes insertadas`)
} catch (err) {
  console.error('Error en seed:', err.message)
} finally {
  await mongoose.connection.close()
}
