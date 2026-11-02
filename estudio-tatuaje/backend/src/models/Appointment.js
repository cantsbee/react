import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    date: { type: Date, required: true },
    idea: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
      description: 'Descripción de la idea de tatuaje',
    },
    bodyPart: { type: String, trim: true, maxlength: 80 },
    status: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada'],
      default: 'pendiente',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Appointment', appointmentSchema)
