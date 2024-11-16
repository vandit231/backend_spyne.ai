// backend/models/Car.js
const mongoose = require('mongoose');
const ImageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
});
const CarSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: { type: String },
  tags:        [{ type: String }],
  images: [ImageSchema],
  car_type:    { type: String },
  company:     { type: String },
  dealer:      { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);
