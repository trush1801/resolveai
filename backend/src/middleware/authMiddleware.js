const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token arrives in the Authorization header as a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token signature against our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user info from Postgres, excluding the password hash, and attach to request object
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };