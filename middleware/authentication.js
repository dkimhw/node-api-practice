const CustomError = require('../errors');
const { isTokenValid } = require('../utils');


const authenticateUser = async (req, res, next) => {
  try {
    const token = req.signedCookies?.token;

    if (!token) throw new CustomError.UnauthenticatedError('Authentication invalid.');

    const {name, userId, role} = isTokenValid({token});
    req.user = { name, userId, role };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authenticateUser };
