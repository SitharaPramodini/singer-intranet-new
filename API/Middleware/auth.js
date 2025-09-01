exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized: Please log in" });
};

exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admins only" });
};
