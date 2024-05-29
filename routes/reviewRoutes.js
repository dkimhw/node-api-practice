
const express = require('express');
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getSingleReview,
  getAllReviewsByProduct,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { authenticateUser } = require('../middleware/authentication');

// all existing reviews
router.route('/').get(getAllReviews);

// product id is passed via req body
router.route('/create')
  .post(authenticateUser, createReview);

// all existing reviews for a product
router.route('/:productId/reviews')
  .get(getAllReviewsByProduct);

router.route('/:reviewId')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);


module.exports = router;
