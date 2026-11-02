// Genera los CSV de ejemplo (clientes, citas, ventas) usando el módulo fs.
// Simula la descarga de un Excel: los ficheros quedan en backend/data/*.csv
// Uso: node scripts/generate-csv.js
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'data')
mkdirSync(dataDir, { recursive: true })

const nombres = [
  'Lucía Fernández', 'Mateo García', 'Camila Rodríguez', 'Santiago López', 'Valentina Martínez',
  'Diego Hernández', 'Sofía Gómez', 'Joaquín Díaz', 'Martina Paredes', 'Tomás Ruiz',
  'Isabella Cruz', 'Benjamín Ortiz', 'Emilia Vargas', 'Lucas Molina', 'Victoria Rojas',
  'Nicolás Álvarez', 'Catalina Romero', 'Agustín Soto', 'Diana Torres', 'Andrés Navarro',
  'Paula Delgado', 'Ricardo Fuentes', 'Elena Cabrera', 'Fernando Ríos', 'Julieta Mora',
  'Gonzalo Peña', 'Renata Aguilar', 'Iván Castillo', 'Micaela Bravo', 'Héctor Salas',
  'Trinidad Núñez', 'Rodrigo Campos', 'Bianca Reyes', 'Esteban Lara', 'Antonella Gil',
  'Mauricio Vega', 'Francesca Solís', 'Emiliano Duarte', 'Rocío Méndez', 'Sebastián Pinto',
]

const ciudades = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Zaragoza', 'Málaga', 'Granada']

const zonas = ['antebrazo', 'espalda', 'hombro', 'pierna', 'costillas', 'muñeca', 'clavícula', 'muslo']

const ideas = [
  'Girasol realista con sombras suaves', 'Cuervo en estilo grabado', 'Franja de olas estilo japonés',
  'Retrato pequeño en línea fina', 'Mariposa acuarela', 'Rama de laurel minimalista',
  'Reloj de bolsillo antiguo', 'Lobo geométrico', 'Pluma con frase en cursiva', 'Mandala en el hombro',
  'Rosa tradicional color', 'Árbol genealógico estilizado', 'Fases de la luna', 'Carta de baraja',
  'Dragonfly y flores', 'Compass con montañas', 'Feather y cuentas', 'Ancla vintage',
  'Rosa y calavera tradicional', 'Bota de aviador con alas', 'Corazón sagrado', 'Águila en vuelo',
]

const conceptos = ['Sesión de tatuaje', 'Diseño personalizado', 'Sesión de retoque', 'Consulta de diseño', 'Tamaño pequeño', 'Sesión extendida']

const metodos = ['efectivo', 'tarjeta', 'transferencia']
const estados = ['pendiente', 'confirmada', 'cancelada']

function fecha(i, baseMonth = 1) {
  const day = ((i * 7) % 27) + 1
  const month = ((i * 3) % 12) + baseMonth
  const m = ((month - 1) % 12) + 1
  return `2025-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function csvEscape(value) {
  const s = String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function toCsv(rows) {
  return rows.map((row) => row.map(csvEscape).join(',')).join('\n') + '\n'
}

// 40 clientes
const clientes = [['id', 'name', 'email', 'phone', 'city', 'since']]
nombres.forEach((name, i) => {
  const id = i + 1
  const email = `${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '.')}@mail.com`
  clientes.push([id, name, email, `6${String(10000000 + i * 137249).slice(0, 8)}`, ciudades[i % ciudades.length], fecha(i, 1)])
})

// 70 citas relacionadas con clientes (cliente_id → clientes.id)
const citas = [['id', 'cliente_id', 'date', 'idea', 'bodyPart', 'status']]
for (let i = 1; i <= 70; i++) {
  const clienteId = ((i * 11) % 40) + 1
  citas.push([i, clienteId, fecha(i, 2), ideas[i % ideas.length], zonas[i % zonas.length], estados[i % estados.length]])
}

// 50 ventas relacionadas con clientes y (algunas) con citas
const ventas = [['id', 'cliente_id', 'cita_id', 'concept', 'amount', 'date', 'paymentMethod']]
for (let i = 1; i <= 50; i++) {
  const clienteId = ((i * 13) % 40) + 1
  const citaId = i <= 40 ? i * 1 || '' : ''
  const amount = [45, 60, 80, 120, 150, 200, 250][i % 7]
  ventas.push([
    i,
    clienteId,
    i <= 35 ? ((i * 7) % 70) + 1 : '',
    conceptos[i % conceptos.length],
    amount,
    fecha(i, 3),
    metodos[i % metodos.length],
  ])
}

writeFileSync(join(dataDir, 'clientes.csv'), toCsv(clientes), 'utf8')
writeFileSync(join(dataDir, 'citas.csv'), toCsv(citas), 'utf8')
writeFileSync(join(dataDir, 'ventas.csv'), toCsv(ventas), 'utf8')

const total = (clientes.length - 1) + (citas.length - 1) + (ventas.length - 1)
console.log(`CSV generados en data/:`)
console.log(`  clientes.csv → ${clientes.length - 1} registros`)
console.log(`  citas.csv    → ${citas.length - 1} registros`)
console.log(`  ventas.csv   → ${ventas.length - 1} registros`)
console.log(`  Total: ${total} registros`)
