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
    errors.push({ msg: 'mật khẩu không trùng khớp' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Mật khẩu tối thiểu có 6 ký tự' });
  }

  if (errors.length > 0) {
    res.render('register', {
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

router.get('/info',ensureAuthenticated,async function (req, res) {
  const user = await User.findOne({id:req.params.id});
  res.render('user_info',{ user: user});
});




// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Đã đăng xuất tài khoản');
  res.redirect('/users/login');
});





module.exports = router;
