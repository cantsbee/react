# 🌻 Estudio Girasol — Plataforma de citas para estudio de tatuajes

Aplicación web completa para un estudio de tatuajes: los clientes exploran la galería, se registran y reservan citas; el administrador gestiona citas, mensajes, clientes, ventas y galería desde un panel.

---

## 1. Propósito

- **Cliente**: descubrir el trabajo del estudio, crear una cuenta y solicitar una cita con su idea de tatuaje, consultar sus citas y su estado.
- **Administrador**: gestionar el flujo completo del negocio — solicitudes de cita (confirmar/cancelar), mensajes de contacto, imágenes de la galería (subida a Cloudinary), clientes y ventas con resumen de ingresos.

Público objetivo: estudio de tatuaje pequeño que trabaja **por cita previa** y necesita digitalizar su gestión sin complejidad.

---

## 2. Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Backend | **Node.js + Express 5** |
| Base de datos | **MongoDB Atlas** con **Mongoose 9** |
| Autenticación | **JWT** (`jsonwebtoken`) + **bcryptjs** (hash de contraseñas) |
| Ficheros | **Multer** (multipart/form-data) + **Cloudinary** |
| Frontend | **React 19 + Vite** |
| Enrutado | **react-router-dom 7** |
| Estilos | **styled-components** (con theme + GlobalStyle) |
| Formularios | **react-hook-form + zod** (validación declarativa) |
| Animaciones | **framer-motion** |
| Seed | Scripts Node con módulo **fs** que leen CSV |

---

## 3. Arquitectura

```
estudio-tatuaje/
├── backend/                      # API REST
│   ├── data/                     # CSV generados (clientes, citas, ventas)
│   ├── scripts/generate-csv.js   # genera los CSV con fs (simula Excel → CSV)
│   └── src/
│       ├── server.js             # Express: CORS, rutas, manejo de errores
│       ├── config/db.js          # conexión MongoDB (MONGODB_URI)
│       ├── middleware/auth.js    # requireAuth + requireRole (JWT)
│       ├── models/               # User, Client, Appointment, Sale, Contact, GalleryItem
│       ├── routes/               # auth, appointments, contact, gallery, clients, sales
│       ├── seed.js               # semilla de galería
│       └── seed-csv.js           # semilla principal (lee CSV con fs)
│
└── estudioTatuaje/               # Frontend React
    ├── vite.config.js            # proxy /api → localhost:4000
    └── src/
        ├── main.jsx              # ThemeProvider + AuthProvider + rutas
        ├── App.jsx               # layout: Header + Outlet + Footer
        ├── styles/               # theme.js, GlobalStyle.js, formComponents.js
        ├── context/              # auth-context, AuthContext (provider), useAuth
        ├── api/client.js         # cliente fetch con token JWT + manejo 401
        ├── components/           # Header, Footer, Hero, Gallery, ImageCard, ProtectedRoute
        └── pages/                # Home, About, Citas, Contact, Login, Register, Admin
```

### Modelo de datos (relaciones)

```
User (rol: admin | client)
Client ──< Appointment (cita: date, idea, bodyPart, status)
Client ──< Sale (venta: concept, amount, date, paymentMethod)
         Sale ──> Appointment (opcional)
Contact (mensajes)   GalleryItem (imágenes + publicId de Cloudinary)
```

---

## 4. Autenticación y autorización

- `POST /api/auth/register` → crea usuario con rol **`client`** (el `admin` se crea por seed).
- `POST /api/auth/login` → devuelve `{ token, user }` (JWT 7 días).
- `GET /api/auth/me` → perfil del usuario logueado.
- **Middleware**: `requireAuth` verifica el token y `requireRole('admin')` restringe rutas.

| Ruta | Público | Client | Admin |
| --- | --- | --- | --- |
| `GET /api/gallery` | ✅ | ✅ | ✅ |
| `POST /api/appointments` | ✅ | ✅ | ✅ |
| `POST /api/contact` | ✅ | ✅ | ✅ |
| `GET /api/appointments` | ❌ 401 | ✅ solo las suyas | ✅ todas |
| `PATCH /api/appointments/:id/status` | ❌ | ❌ 403 | ✅ |
| `GET /api/contact` (listar) | ❌ | ❌ 403 | ✅ |
| `POST /api/gallery/upload` | ❌ | ❌ 403 | ✅ |
| `GET /api/clients`, `GET /api/sales` | ❌ | ❌ 403 | ✅ |

En el frontend, `ProtectedRoute` exige sesión y rol; sin sesión redirige a `/login`, con rol incorrecto a `/`. El token se guarda en `localStorage` y el cliente HTTP lo adjunta y limpia la sesión automáticamente en `401`.

---

## 5. Datos iniciales (seed) — requisito de la rúbrica

1. **Modelos Mongoose definidos primero** (`User`, `Client`, `Appointment`, `Sale`…).
2. `npm run generate:csv` → usa el módulo **fs** para **escribir** 3 CSV en `backend/data/`:
   - `clientes.csv` — **40 registros**
   - `citas.csv` — **70 registros** (relacionados con clientes por `cliente_id`)
   - `ventas.csv` — **50 registros** (relacionados con clientes y citas)
   - **Total: 160 registros** (mínimo exigido: 100)
3. `npm run seed:csv` → usa **fs** para **leer** los CSV, los parsea (con soporte de comillas) y los inserta respetando las relaciones (`client` → ObjectId). También crea los usuarios:

| Rol | Email | Contraseña |
| --- | --- | --- |
| admin | `admin@estudio.com` | `admin123` |
| client | `cliente@estudio.com` | `cliente123` |

---

## 6. Subida de ficheros (Cloudinary)

- `POST /api/gallery/upload` recibe **`multipart/form-data`** (campo `file` + `title`, `category`) con **Multer** en memoria, lo envía a **Cloudinary** (`upload_stream`) y guarda `url` + `publicId`.
- Al borrar una imagen también se destruye el recurso en Cloudinary.
- En el frontend: `FormData` + `fetch` (sin forzar `Content-Type`) desde el panel **Admin → galería**.
- Configurar en `backend/.env`:

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 7. Flujo de usuario

**Cliente**
1. Entra en Home → ve la galería (desde MongoDB).
2. **Entrar / Regístrate** (validaciones zod en cliente).
3. **Citas** → rellena el formulario (validado con zod) → se crea/actualiza su `Client` y la cita queda `pendiente`.
4. Consulta sus citas y su estado (badge de color).

**Admin**
1. Login con `admin@estudio.com` → aparece **Admin** en el menú.
2. Panel con pestañas: **resumen** (ingresos por método de pago), **citas** (desde la página Citas: confirmar/cancelar/eliminar), **mensajes** (marcar leído/borrar), **galería** (subir a Cloudinary/borrar), **clientes** (tabla + ventas).

---

## 8. Ejecución

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env      # completar MONGODB_URI, JWT_SECRET y Cloudinary
npm run generate:csv      # genera los CSV (fs)
npm run seed:csv          # inserta 160 registros + usuarios
npm run dev               # http://localhost:4000

# 2. Frontend (otra terminal)
cd estudioTatuaje
npm install
npm run dev               # http://localhost:5173
```

Scripts disponibles en `backend/`: `dev`, `start`, `seed` (galería), `seed:csv`, `generate:csv`.

---

## 9. Endpoints de la API

Ver documentación completa en [`backend/README.md`](backend/README.md).

| Método | Ruta | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` · `/api/auth/login` | público |
| GET | `/api/auth/me` | logueado |
| GET/POST | `/api/appointments` | logueado / público (POST) |
| PATCH/DELETE | `/api/appointments/:id/...` | admin |
| GET/POST | `/api/contact` | admin / público (POST) |
| GET | `/api/gallery` · POST `/api/gallery` · POST `/api/gallery/upload` | público / admin |
| GET/POST | `/api/clients`, `/api/sales` · GET `/api/sales/summary` | admin |
| GET | `/api/health` | público |

---

## 10. Decisiones de diseño (UX/UI)

- **Paleta cálida** coherente en todo el sitio: fondo crema, acento dorado y verde profundo (identidad "girasol").
- **Formularios en 2 columnas** con errores inline bajo cada campo (zod + react-hook-form) y feedback de éxito/error.
- **Badges de estado** con color semántico: amarillo = pendiente, verde = confirmada, rojo = cancelada.
- **Animaciones con framer-motion** sutiles: entrada del hero, aparición de tarjetas al hacer scroll, transiciones entre pestañas del panel — sin ralentizar la lectura.
- **Navegación según sesión**: el menú muestra "Entrar" o el usuario con su rol; "Admin" solo aparece para administradores.
- **Estados vacíos** con mensajes claros ("Aún no hay citas", "Inicia sesión para ver tus citas").
