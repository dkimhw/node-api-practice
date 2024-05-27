const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
  } catch (err) {
    next(err);
  }

};

const getAllProducts = (req, res) => {
  res. send('get all products');
};

const getSingleProduct = (req, res) => {
  res.send('get single product');
};

const deleteProduct = (req, res) => {
  res.send('delete product');
};

const updateProduct = (req, res) => {
  res.send('update product');
};


const uploadImage = (req, res) => {
  res.send('upload image');
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
}
