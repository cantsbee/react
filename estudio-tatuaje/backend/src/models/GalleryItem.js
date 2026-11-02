import mongoose from 'mongoose'

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, trim: true, maxlength: 60, default: 'general' },
    url: { type: String, required: true, trim: true, maxlength: 500 },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    publicId: { type: String }, // public_id de Cloudinary para borrar el fichero
  },
  { timestamps: true }
)

export default mongoose.model('GalleryItem', galleryItemSchema)
