
const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const checkPermissions = require('../utils/checkPermissions');

const createReview = async (req, res, next) => {
  try {
    // Check product id
    const { product: productId } = req.body;
    const isValidProduct = await Product.findOne({ _id: productId });
    if (!isValidProduct) throw new CustomError.NotFoundError(`No product with id: ${productId}.`);

    // Check if review exists
    const alreadySubmitted = await Review.findOne({
      product: productId,
      user: req.user.userId,
    });
    if (alreadySubmitted) throw new CustomError.BadRequestError(`Already submitted review for this product.`);

    req.body.user = req?.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({ review });
  } catch (err) {
    next(err);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({}).populate({
      path: 'product',
      select: 'name company price'
    });

    if (!reviews) throw new CustomError.BadRequestError('No reviews found');

    res.status(StatusCodes.OK).json({ reviews, count: reviews?.length });
  } catch (err) {
    next(err);
  }
};

const getAllReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate({
      path: 'product',
      select: 'name company price'
    });
    if (!reviews) throw new CustomError.BadRequestError('No reviews found');

    res.status(StatusCodes.OK).json({ reviews, count: reviews?.length });
  } catch (err) {
    next(err);
  }
};

const getSingleReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById({ _id: reviewId });
    if (!review) throw new CustomError.BadRequestError(`No review found for ${reviewId}`);

    res.status(StatusCodes.OK).json({ review });
  } catch (err) {
    next(err);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { title, comment, rating } = req.body;
    const review = await Review.findById({ _id: reviewId });
    if (!review) throw new CustomError.BadRequestError(`No review found for ${reviewId}`);

    review.title = title;
    review.comment = comment;
    review.rating = rating;

    checkPermissions(req.user, review.user);

    await review.save();

    res.status(StatusCodes.OK).json({ review });
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById({ _id: reviewId });
    if (!review) throw new CustomError.BadRequestError(`No review found for ${reviewId}`);

    checkPermissions(req.user, review.user);

    await review.remove();

    res.status(StatusCodes.OK).json({ msg: 'Succesfully deleted the review.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getAllReviewsByProduct,
}
