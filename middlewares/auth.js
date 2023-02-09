const User = require("../models/userModel");

const jwt = require("jsonwebtoken");
const ErrorHandle = require("../utils/errorHandle");
const bigPromise = require("./bigPromise");

// Checks if user is authenticated or not
exports.isAuthenticatedUser = bigPromise(async (req, res, next) => {
    
  const { token } = req.body;

  if (!token) {
    return next(new ErrorHandle("Login first to access this resource.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

// Handling users roles
// exports.authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorHandler(
//           `Role (${req.user.role}) is not allowed to acccess this resource`,
//           403
//         )
//       );
//     }
//     next();
//   };
// };
