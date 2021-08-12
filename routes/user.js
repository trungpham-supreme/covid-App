const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// Get Users model
var User = require('../models/user');

// Register Page
router.get('/register', (req, res) => {if (req.user) res.redirect('/'); res.render('register')});

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (req.user) res.redirect('/');

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Vui lòng điền đầy đủ thông tin' });
  }

  if (password != password2) {
    errors.push({ msg: 'Mật khẩu không trùng khớp' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Mật khẩu tối thiểu có 6 ký tự' });
  }

  if (errors.length > 0) {
    res.render('register', {
      user: null,
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email đã tồn tại' });
        res.render('register', {
          user: null,
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const user = new User({
          name: name, 
          email: email,
          password: password,
          admin: 0
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Tạo tài khoản thành công, bạn có thể đăng nhập'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


// Login Page
router.get('/login', function (req, res) {
    if (req.user) res.redirect('/');    
    res.render('login', {
        title: 'Log in'
    });
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/info',ensureAuthenticated,async (req, res)=> {
  const user = await User.findById(req.user.id);
  res.render('user_info',{ user: user});
});

router.put('/info',ensureAuthenticated,async (req, res, next)=> {
  
   await User.findById(req.user.id);
   next();
  },saveUserAndRedirect('user/info'));


// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Đã đăng xuất tài khoản');
  res.redirect('/users/login');
});


function saveUserAndRedirect(path) {
  return async (req, res) => {
    const errors = [];
    let user = req.user
    user.name = req.body.name
    user.password = req.body.password
    user.password2 = req.body.password2
    if (user.password != user.password2) {
      errors.push({ msg: 'Mật khẩu không trùng khớp' });
    }
    if (user.name.length < 6) {
      errors.push({ msg: 'Tên tối thiểu có 6 ký tự' });
    }
  
    if (user.password.length < 6) {
      errors.push({ msg: 'Mật khẩu tối thiểu có 6 ký tự' });
    }
  
    if (errors.length > 0) {
      res.render('user_info', {
        errors,
        user: user
      });
    } else

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then(user => {
              req.flash(
                'success_msg',
                'Đổi thông tin tài khoản thành công'
              );
              res.redirect('/users/info');
            })
            .catch(err => console.log(err));
        });
      });


      
     
  }
}





module.exports = router;
