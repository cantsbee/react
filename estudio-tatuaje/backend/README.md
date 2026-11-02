# Backend — Estudio Girasol

API REST con **Node.js + Express + MongoDB (Mongoose)** + autenticación JWT + Cloudinary.

## Requisitos

- Node.js 18+
- MongoDB local o una cuenta de MongoDB Atlas

## Configuración

```bash
cd backend
cp .env.example .env   # y completa MONGODB_URI, JWT_SECRET y Cloudinary
npm install
```

Variables del `.env`:

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor (default `4000`) |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/estudio_tatuaje` o Atlas |
| `CLIENT_URL` | Origen permitido por CORS (frontend Vite) |
| `JWT_SECRET` | Secreto para firmar los tokens |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Subida de ficheros |

## Ejecutar

```bash
npm run dev           # desarrollo (node --watch)
npm start             # producción
npm run generate:csv  # genera data/*.csv con el módulo fs (160 registros)
npm run seed:csv      # lee los CSV con fs e inserta clientes, citas, ventas y usuarios
npm run seed          # semilla de la galería (2 imágenes de ejemplo)
```

### Usuarios sembrados

| Rol | Email | Contraseña |
| --- | --- | --- |
| admin | admin@estudio.com | admin123 |
| client | cliente@estudio.com | cliente123 |

## Modelos (Mongoose)

- **User** — name, email (unique), password (hash bcrypt), role `admin|client`
- **Client** — name, email (unique), phone, city, since
- **Appointment** — `client` (ref), date, idea, bodyPart, status `pendiente|confirmada|cancelada`
- **Sale** — `client` (ref), `appointment` (ref opcional), concept, amount, date, paymentMethod `efectivo|tarjeta|transferencia`
- **Contact** — name, email, message, read
- **GalleryItem** — title, category, url, order, published, publicId (Cloudinary)

## Endpoints

### Auth — `/api/auth`

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| POST | `/register` | público | Alta con rol `client` → `{ token, user }` |
| POST | `/login` | público | Login → `{ token, user }` |
| GET | `/me` | logueado | Perfil del usuario |

### Citas — `/api/appointments`

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/` | logueado | Admin: todas (+`?status=`). Client: solo las suyas |
| GET | `/:id` | logueado | Detalle (propia o admin) |
| POST | `/` | público | Crear solicitud (`name, email, date, idea`) — crea/reutiliza el `Client` por email |
| PATCH | `/:id/status` | admin | Cambiar estado |
| DELETE | `/:id` | admin | Eliminar |

### Contacto — `/api/contact`

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/` | admin |
| POST | `/` | público (`name, email, message`) |
| PATCH | `/:id/read` | admin |
| DELETE | `/:id` | admin |

### Galería — `/api/gallery`

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/` | público | Imágenes publicadas |
| POST | `/` | admin | Agregar por URL (`title, url`) |
| POST | `/upload` | admin | **multipart/form-data** (`file`, `title`, `category`) → Cloudinary |
| PUT | `/:id` | admin | Actualizar |
| DELETE | `/:id` | admin | Borrar (DB + Cloudinary) |

### Clientes y ventas — `/api/clients`, `/api/sales` (solo admin)

- `GET/POST /api/clients`, `GET /api/clients/:id` (cliente + citas + ventas)
- `GET/POST /api/sales`, `GET /api/sales/summary` (agregación: total e ingresos por método)

### Salud

- `GET /api/health` → `{ "status": "ok" }`
