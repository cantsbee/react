import mongoose from 'mongoose'

const saleSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    concept: { type: String, required: true, trim: true, maxlength: 120 },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ['efectivo', 'tarjeta', 'transferencia'],
      default: 'efectivo',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Sale', saleSchema)
