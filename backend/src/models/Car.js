const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Car title is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    index: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    index: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category reference is required'],
    index: true
  },
  mileage: {
    type: Number,
    required: [true, 'Mileage is required']
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    required: true,
    index: true
  },
  transmission: {
    type: String,
    enum: ['Automatic', 'Manual'],
    required: true,
    index: true
  },
  engine: {
    type: String,
    default: 'N/A'
  },
  color: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Sold'],
    default: 'Available',
    index: true
  },
  images: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  specifications: {
    horsepower: { type: String, default: 'N/A' },
    acceleration: { type: String, default: 'N/A' },
    topSpeed: { type: String, default: 'N/A' },
    drivetrain: { type: String, default: 'N/A' },
    seatingCapacity: { type: Number, default: 5 },
    doors: { type: Number, default: 4 },
    warranty: { type: String, default: '3 Years / 36,000 Miles' }
  }
}, {
  timestamps: true
});

carSchema.index({ title: 'text', brand: 'text', model: 'text', description: 'text' });

module.exports = mongoose.model('Car', carSchema);
