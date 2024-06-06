
const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, 'Please provide a rating.'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    trim: true,
    required: [true, 'Please provide a review title']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review of the product.']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  }
}, {timestamps: true});

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  console.log(productId);
}

ReviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post('remove', async function() {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = new mongoose.model('Review', ReviewSchema);
