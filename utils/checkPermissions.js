
const CustomError = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser?.role === 'admin') return;
  if (requestUser.userId === String(resourceUserId)) return;

  throw new CustomError.UnauthenticatedError('Not authorized to access this route.');
};

module.exports = checkPermissions;
