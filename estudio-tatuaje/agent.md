# AGENT.md

Guía del proyecto para agentes de IA que trabajen en este repositorio.

## Descripción

**Estudio Girasol**: plataforma de citas para un estudio de tatuajes. Frontend **React 19 + Vite** y API **Node.js + Express + MongoDB (Mongoose)** con autenticación JWT (roles `admin`/`client`), seed desde CSV y subida de imágenes a Cloudinary.

## Estructura

```
estudio-tatuaje/
├── agent.md / README.md        # documentación
├── backend/                    # API Express + Mongoose (ver backend/README.md)
│   ├── .env                    # MONGODB_URI (Atlas), JWT_SECRET, Cloudinary — NO commitear
│   ├── data/                   # clientes.csv, citas.csv, ventas.csv (160 registros)
│   ├── scripts/generate-csv.js # escribe los CSV con fs (npm run generate:csv)
│   └── src/
│       ├── server.js           # entry point, CORS, rutas, errores
│       ├── config/db.js        # conexión MongoDB
│       ├── middleware/auth.js  # requireAuth, requireRole, signToken
│       ├── models/             # User, Client, Appointment, Sale, Contact, GalleryItem
│       ├── routes/             # auth, appointments, contact, gallery, clients, sales
│       ├── seed.js             # semilla de galería
│       └── seed-csv.js         # lee CSV con fs → inserta 160 registros + usuarios
└── estudioTatuaje/             # Frontend Vite
    ├── vite.config.js          # proxy /api → http://localhost:4000
    └── src/
        ├── main.jsx            # ThemeProvider + AuthProvider + rutas (incl. /admin)
        ├── App.jsx             # layout: Header + Outlet + Footer
        ├── styles/             # theme.js, GlobalStyle.js, formComponents.js
        ├── context/            # auth-context.js, AuthContext.jsx (provider), useAuth.js
        ├── api/client.js       # fetch con token JWT + cierre de sesión en 401
        ├── components/         # Header, Footer, Hero, gallery, ImageCard, ProtectedRoute
        └── pages/              # Home, About, Citas, Contact, Login, Register, Admin
```

## Comandos

Frontend (en `estudioTatuaje/`): `npm run dev` (5173) · `npm run build` · `npm run lint`

Backend (en `backend/`): `npm run dev` (4000) · `npm start` · `npm run generate:csv` · `npm run seed:csv` · `npm run seed`

> El puerto 5000 está ocupado por AirPlay en macOS → el backend usa el **4000**.

## Autenticación

- JWT en `localStorage`; el cliente `src/api/client.js` adjunta `Authorization: Bearer` y limpia la sesión en 401.
- Roles: **admin** (gestiona todo) y **client** (solo sus citas). El registro público siempre crea `client`.
- `ProtectedRoute` (en `main.jsx`) protege `/admin` con `roles={['admin']}`.
- Usuarios seed: `admin@estudio.com/admin123` · `cliente@estudio.com/cliente123`.

## Reglas de autorización de la API

- Públicos: `GET /api/gallery`, `POST /api/appointments`, `POST /api/contact`, auth.
- Logueado: `GET /api/appointments` (client = solo las suyas; admin = todas).
- Solo admin: cambiar estado/borrar citas, listar mensajes, galería (POST/PUT/DELETE/upload), `/api/clients`, `/api/sales`.

## Convenciones

- **Estilos**: styled-components con `theme` (paleta crema/dorado/verde) + `GlobalStyle`. NO añadir CSS puro nuevo (los `.css` viejos fueron eliminados).
- **Formularios**: react-hook-form + zod (`zodResolver`), errores inline con `FieldError`. Estilos reutilizables en `src/styles/formComponents.js`.
- **Animaciones**: framer-motion, sutiles (entrada, whileInView, transiciones de pestaña).
- **API**: siempre vía `src/api/client.js` (proxy de Vite → `localhost:4000`).
- **Seed**: los modelos se definen ANTES de las semillas; los CSV se generan/leen con el módulo `fs`.
- **Idioma**: contenido y comentarios en español.
- **Sin dependencias nuevas** sin confirmación previa.

## Estado pendiente

- **Cloudinary configurado** con credenciales en `backend/.env` (`CLOUDINARY_*`). Verificado: subida vía form-data y borrado remoto funcionan.
- Los formularios/pestañas del admin manejan errores de red, pero no hay tests automatizados.
- `About.jsx` aún usa clases CSS globales (en `GlobalStyle`) en lugar de styled-components.
