const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
}

const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select('-password');
    if (!user) throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);

    checkPermissions(req.user, user._id);

    res.status(StatusCodes.OK).json({ user });
  } catch (err) {
    next(err);
  }

}

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
}

const updateUser = async (req, res, next) => {
  const { email, name } = req.body;

  try {
    if (!email || !name)
      throw new CustomError.BadRequestError('Please provide all values.');

    const user = await User.findOne({ _id: req.user.userId });
    user.email = email;
    user.name = name;
    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser});
    res.status(StatusCodes.OK).json({ user: tokenUser });
  } catch (err) {

  }
}

const updateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) throw new CustomError.BadRequestError('Please provide both values.');

    // validate that passwords are different
    const user = await User.findOne({ _id: req.user.userId });
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) throw new CustomError.UnauthenticatedError('Invalid credentials');

    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({ msg: 'Success! Password updated.'});
  } catch (err) {
    next(err);
  }

}


module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
};
