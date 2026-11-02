import { Router } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import GalleryItem from '../models/GalleryItem.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

// Subida en memoria (luego se envía a Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true)
    else cb(new Error('Solo se permiten imágenes'))
  },
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// GET /api/gallery — listar imágenes publicadas (público)
router.get('/', async (req, res, next) => {
  try {
    const items = await GalleryItem.find({ published: true }).sort({ order: 1, createdAt: 1 })
    res.json(items)
  } catch (err) {
    next(err)
  }
})

// POST /api/gallery — agregar imagen por URL (solo admin)
router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { title, category, url, order } = req.body
    if (!title || !url) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: title, url' })
    }
    const item = await GalleryItem.create({ title, category, url, order })
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
})

// POST /api/gallery/upload — subir fichero vía form-data a Cloudinary (solo admin)
// El frontend envía FormData con campo 'file' + title/category
router.post(
  '/upload',
  requireAuth,
  requireRole('admin'),
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'Falta el archivo (campo file)' })
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(500).json({ message: 'Cloudinary no está configurado en .env' })
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'estudio-girasol' },
          (err, uploaded) => (err ? reject(err) : resolve(uploaded))
        )
        stream.end(req.file.buffer)
      })

      const item = await GalleryItem.create({
        title: req.body.title || req.file.originalname,
        category: req.body.category || 'general',
        url: result.secure_url,
        publicId: result.public_id,
      })
      res.status(201).json(item)
    } catch (err) {
      next(err)
    }
  }
)

// PUT /api/gallery/:id — actualizar imagen (solo admin)
router.put('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { title, category, url, order, published } = req.body
    const item = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      { title, category, url, order, published },
      { returnDocument: 'after', runValidators: true }
    )
    if (!item) return res.status(404).json({ message: 'Imagen no encontrada' })
    res.json(item)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/gallery/:id — borra en DB y en Cloudinary (solo admin)
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Imagen no encontrada' })
    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId).catch(() => {})
    }
    res.json({ message: 'Imagen eliminada' })
  } catch (err) {
    next(err)
  }
})

export default router
