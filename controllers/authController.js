const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createJWT, isTokenValid } = require('../utils');

const register = async (req, res, next) => {
  const { email, name, password } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) throw new CustomError.BadRequestError('Email already exists');

    // first registered user is an admin
    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    const tokenUser = { name: user.name, userId: user._id, role: user.role };

    const token = createJWT({ payload: tokenUser});

    res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
  } catch (err) {
    next(err);
  }
}

const login = (req, res) => {
  res.send('login');
};

const logout = (req, res) => {
  res.send('logout');
};

module.exports = {
  register,
  login,
  logout
};
