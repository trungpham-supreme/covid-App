const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/',async (req, res) =>{
  const users = await User.find({admin: 0}).sort({
    date: 'desc'
  }); 
  res.render('admin/account',{ users: users});
});

router.delete('/:id', async(req, res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/accounts');
});


module.exports = router;