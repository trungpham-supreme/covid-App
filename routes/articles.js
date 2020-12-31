var express = require('express');
var router = express.Router();
const Article = require('../models/article');




router.get('/info', (req,res)=>{
	res.render('info');
});


router.get('/news',async (req, res) =>{
  const articles = await Article.find().sort({
    createdAt: 'desc'
  }); 
  res.render('news',{ articles: articles});
});


router.get('/news/:slug',async (req, res)=>{
  const article = await Article.findOne({slug:req.params.slug});
  if(article == null) res.redirect('/');
  const articles = await Article.find().sort({
    createdAt: 'desc'
  });
  res.render('show_news', {article: article,articles: articles});
});



module.exports = router;




