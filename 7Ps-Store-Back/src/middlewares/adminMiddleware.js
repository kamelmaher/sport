


const adminFilter = (req, res, next) => {
    const user = req.user; 
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator privileges required',
        requiredRole: 'admin',
        currentRole: user.role
     });
    }
    next();
};

module.exports = adminFilter;