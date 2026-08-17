const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car reference is required'],
    index: true
  },
  startDate: {
    type: Date,
    required: [true, 'Reservation start / pickup date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'Reservation end / return date is required']
  },
  totalDays: {
    type: Number,
    required: true,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },

  // ── STATUS ────────────────────────────────────────────────────────────────
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending',
    index: true
  },

  // ── CUSTOMER INFO ─────────────────────────────────────────────────────────
  contactPhone: {
    type: String,
    trim: true,
    required: [true, 'Contact phone is required']
  },
  driverLicense: {
    type: String,
    trim: true,
    required: [true, "Driver's license number is required"]
  },
  pickupLocation: {
    type: String,
    default: 'AutoLuxe VIP Flagship Showroom'
  },
  customerNotes: {
    type: String,
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  },

  // ── LIFECYCLE TIMESTAMPS ─────────────────────────────────────────────────
  cancellationReason: {
    type: String,
    default: ''
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  confirmedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

reservationSchema.index({ car: 1, status: 1 });
reservationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Reservation', reservationSchema);
