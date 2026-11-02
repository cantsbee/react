// Semilla principal: lee los CSV de data/ con el módulo fs y los inserta
// en MongoDB, respetando las relaciones clientes → citas → ventas.
// También crea los usuarios de prueba (admin y client).
// Uso: npm run seed:csv
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import mongoose from 'mongoose'

import { connectDB } from './config/db.js'
import Client from './models/Client.js'
import Appointment from './models/Appointment.js'
import Sale from './models/Sale.js'
import User from './models/User.js'
import GalleryItem from './models/GalleryItem.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'data')

// --- Parser CSV mínimo (respeta comillas) ---
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') inQuotes = false
      else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows
}

function readCsv(name) {
  const [header, ...rows] = parseCsv(readFileSync(join(dataDir, name), 'utf8'))
  return rows
    .filter((r) => r.some((v) => v !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])))
}

try {
  await connectDB()

  // Limpieza previa (no tocamos Contact ni GalleryItem de otros seeds)
  await Promise.all([Client.deleteMany({}), Appointment.deleteMany({}), Sale.deleteMany({}), User.deleteMany({})])

  // 1) Clientes
  const clientRows = readCsv('clientes.csv')
  const clients = await Client.insertMany(
    clientRows.map((r) => ({
      name: r.name,
      email: r.email,
      phone: r.phone,
      city: r.city,
      since: r.since ? new Date(r.since) : undefined,
    }))
  )
  // Mapa id-del-CSV → _id de Mongo
  const clientMap = new Map(clientRows.map((r, i) => [r.id, clients[i]._id]))

  // 2) Citas (relación con clientes)
  const appointmentRows = readCsv('citas.csv')
  const appointments = await Appointment.insertMany(
    appointmentRows.map((r) => ({
      client: clientMap.get(r.cliente_id),
      date: new Date(r.date),
      idea: r.idea,
      bodyPart: r.bodyPart,
      status: r.status,
    }))
  )
  const appointmentMap = new Map(appointmentRows.map((r, i) => [r.id, appointments[i]._id]))

  // 3) Ventas (relación con clientes y, opcional, con citas)
  const saleRows = readCsv('ventas.csv')
  await Sale.insertMany(
    saleRows.map((r) => ({
      client: clientMap.get(r.cliente_id),
      appointment: r.cita_id ? appointmentMap.get(r.cita_id) : undefined,
      concept: r.concept,
      amount: Number(r.amount),
      date: new Date(r.date),
      paymentMethod: r.paymentMethod,
    }))
  )

  // 4) Usuarios (rol admin + client de prueba)
  await User.create([
    { name: 'Admin Girasol', email: 'admin@estudio.com', password: 'admin123', role: 'admin' },
    { name: 'Cliente Demo', email: 'cliente@estudio.com', password: 'cliente123', role: 'client' },
  ])

  console.log('Seed CSV completado:')
  console.log(`  ${clients.length} clientes`)
  console.log(`  ${appointments.length} citas`)
  console.log(`  ${saleRows.length} ventas`)
  console.log('  2 usuarios: admin@estudio.com / admin123 · cliente@estudio.com / cliente123')
} catch (err) {
  console.error('Error en seed:', err)
  process.exitCode = 1
} finally {
  await mongoose.connection.close()
}
