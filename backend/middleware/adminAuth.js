const adminAuth = (req, res, next) => {
  // This middleware must be used AFTER authMiddleware so req.user is available
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

module.exports = adminAuth;
