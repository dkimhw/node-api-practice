const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions
} = require('../middleware/authentication');

const {
  getAllOrders,
  createOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  getCurrentUserOrders,
} = require('../controllers/orderController');

router.route('/')
  .get(authenticateUser, authorizePermissions('admin'), getAllOrders);

router.route('/')
  .post(authenticateUser, createOrder);

router.route('/user')
  .get(authenticateUser, getCurrentUserOrders);

router.route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser,updateOrder)
  .delete(authenticateUser, deleteOrder);

module.exports = router;
