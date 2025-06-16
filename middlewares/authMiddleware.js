exports.isAuthenticated = (req, res, next) => {
  if (req.session.studentId) {
    return next();
  }
  res.redirect('/login');
};
