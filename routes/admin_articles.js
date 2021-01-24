const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const multer  = require('multer');
const path = require('path');
var fileUpload = require('express-fileupload');




const {forwardAuthenticated, ensureAuthenticated, isAdmin } = require('../config/auth');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})


var upload = multer({
  storage: storage
}).single('file');



router.get('/articles',isAdmin,async (req, res) =>{
  const articles = await Article.find().sort({
    createdAt: 'desc'
  }); 
  res.render('admin/articles',{ articles: articles});
});

router.get('/articles/:slug',async (req, res)=>{
  const article = await Article.findOne({slug:req.params.slug});
  if(article == null) res.redirect('/');
  res.render('admin/show_article', {article: article});
});



router.get('/create',isAdmin, (req, res) =>{
  res.render('admin/create_article',{article: new Article()});
});


router.get('/edit/:id', isAdmin, async (req, res) =>{
  const article = await Article.findById(req.params.id);
  res.render('admin/edit_articles',{article: article});
});


router.post('/create', upload, async (req, res)=>{
  let article = new Article({
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
    image: req.file.filename,
    cmtImage: req.body.cmtImage 
  });
  try{
    article = await article.save();
    res.redirect(`/admin/articles/${article.slug}`);

  } catch(e){
    console.log(e);
    res.render('admin/create_article',{article: article});

  }

});

router.put('/:id',upload,async(req, res, next)=>{
  req.article = await Article.findById(req.params.id);
  next();
},saveArticleAndRedirect('admin/edit'));

router.delete('/:id', async(req, res)=>{
  await Article.findByIdAndDelete(req.params.id);
  res.redirect('/admin/articles');
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    cmtImage: req.body.cmtImage 

    try {
      article = await article.save()
      res.redirect(`/admin/articles/${article.slug}`)
    } catch (e) {
      res.render(`admin/${path}`, { article: article })
    }
  }
}



module.exports = router;