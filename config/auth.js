  
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Bạn cần phải đăng nhập!');
    res.redirect('/users/login');
  },
  isAdmin: function(req, res, next) {
    if (req.isAuthenticated() && req.user.admin == 1) {
      return next();
    }
    req.flash('error_msg', 'Vui lòng đăng nhập bằng tài khoản admin!');
    res.redirect('/users/login');
  },

  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');      
  }
};