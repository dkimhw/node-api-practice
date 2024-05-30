const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
  } catch (err) {
    next(err);
  }
};

const getAllProducts = async (req, res, err) => {
  try {
    const products =  await Product.find({});
    res.status(StatusCodes.OK).json({ products, count: products.length });
  } catch (err) {
    next(err);
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById({ _id: req.params?.id }).populate('reviews');

    if (!product) throw new CustomError.NotFoundError(`No product with id ${req.params?.id} found.`);

    res.status(StatusCodes.OK).json( product );
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    const product = await Product.findOneAndUpdate({ _id: productId },
      req.body, { new: true, runValidators: true });

    if (!product) throw new CustomError.NotFoundError(`No product with id ${productId} found.`);

    res.status(StatusCodes.OK).json({ product });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });

    if (!product) throw new CustomError.NotFoundError(`No product with id ${productId} found.`);

    await product.remove();
    res.status(StatusCodes.OK).json({ msg: 'Successfully removed the product.' });
  } catch (err) {
    next(err)
  }
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.files) throw new CustomError.BadRequestError('No file uploaded.');

    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith('image')) throw new CustomError.BadRequestError('Please upload an image');

    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) throw new CustomError.BadRequestError('Please upload image smaller than 1MB');

    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    await productImage.mv(imagePath);

    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
}
