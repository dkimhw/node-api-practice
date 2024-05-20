const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
}

const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select('-password');

    if (!user) throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);

    res.status(StatusCodes.OK).json({ user });
  } catch (err) {
    next(err);
  }

}

const showCurrentUser = async (req, res) => {
  res.send('show current user');
}

const updateUser = async (req, res) => {
  res.send(req.body);
}

const updateUserPassword = async (req, res) => {
  res.send('update password');
}


module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
};
