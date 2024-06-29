const Order = require('../models/Order');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Product = require('../models/Product');
const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';

  return { client_secret, amount};
};

const createOrder = async (req, res, next) => {
  try {
    const { items: cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1) {
      throw new CustomError.BadRequestError('No cart items provided.');
    }

    if (!tax || !shippingFee) {
      throw new CustomError.BadRequestError('Please provide tax and shipping fee.');
    }

    let orderItems = [];
    let subtotal = 0;

    for(const item of cartItems) {
      const dbProduct = await Product.findOne({_id: item.product});

      if (!dbProduct) {
        throw new CustomError.NotFoundError(`No product with id ${item.product}`);
      }

      const { name, price, image, _id } = dbProduct;
      const singleOrderItem = {
        amount: item.amount,
        name,
        price,
        image,
        product: _id,
      };

      orderItems = [...orderItems, singleOrderItem];
      subtotal += item.amount * price;
    }

    // calculate total
    const total = tax + shippingFee + subtotal;

    // get client secret
    const paymentIntent = await fakeStripeAPI({
      amount: total,
      currency: 'usd',
    });

    const order = new Order({
      orderItems, total, subtotal, tax, shippingFee, clientSecret: paymentIntent.client_secret,
      user: req.user.userId
    });
    await order.save();
    res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret });
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders });
  } catch (err) {
    next(err);
  }
};

const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) throw new CustomError.BadRequestError(`Order of id ${req.params.id} does not exist.`);

    res.status(StatusCodes.OK).json({ order });
  } catch (err) {
    next(err);
  }
};

const getCurrentUserOrders = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError.BadRequestError('No user id provided.');
    }

    const orders = await Order.find({ user: userId });
    if (!orders) {
      throw new CustomError.NotFoundError(`No orders found for user ${req.body?.userId}`);
    }

    res.status(StatusCodes.OK).json({ orders, count: orders.length });
  } catch (err) {
    next(err);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findOne(orderId);
    if (!order) {
      throw new CustomError.NotFoundError(`No order found with id: ${orderId}`);
    }

    checkPermissions(req.user, order.user);
    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ order });
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params?.id);
    if (!order) throw new CustomError.BadRequestError('No order was found.');

    await order.remove();
    res.status(StatusCodes.OK).json({ 'msg': 'Order was successfully removed'});
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllOrders,
  createOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  getCurrentUserOrders,
}
