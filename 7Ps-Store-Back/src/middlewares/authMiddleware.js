const jwt = require('jsonwebtoken');
const User = require('./../Modules/Users/user.model');

/**
 * Middleware to authenticate the user and set req.user to the logged in user
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * 
 * @throws {Error} If the user is not authenticated
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
      });
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Please authenticate' });
    }

    // Attach the user to the request
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
};

module.exports = authMiddleware;
