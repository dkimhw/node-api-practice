
const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadImage
} = require('../controllers/productController');
const {
  authenticateUser,
  authorizePermissions
} = require('../middleware/authentication');


router.route('/').get(getAllProducts);
router.route('/create').post(authenticateUser, authorizePermissions('admin', 'owner'), createProduct);

router.route('/uploadImage').post(authenticateUser, authorizePermissions('admin', 'owner'), uploadImage);

router.route('/:id')
  .get(getSingleProduct)
  .delete(authenticateUser, authorizePermissions('admin', 'owner'), deleteProduct)
  .patch(authenticateUser, authorizePermissions('admin', 'owner'), updateProduct);

module.exports = router;
