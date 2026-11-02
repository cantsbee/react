import mongoose from 'mongoose'

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 30 },
    city: { type: String, trim: true, maxlength: 60 },
    since: { type: Date },
  },
  { timestamps: true }
)

export default mongoose.model('Client', clientSchema)
