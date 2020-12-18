const express = require('express');
const router = express.Router();
const Article = require('../models/articles');



router.get('/articles',async (req, res) =>{
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



router.get('/create', (req, res) =>{
	res.render('admin/create_article',{article: new Article()});
});


router.post('/create', async (req, res)=>{
	let article = new Article({
		title: req.body.title,
		description: req.body.description,
		markdown: req.body.markdown
	});
	try{
		article = await article.save();
		res.redirect(`/admin/articles/${article.slug}`);
	} catch(e){
		console.log(e);
		res.render('admin/create_article',{article: article});
	}
});




module.exports = router;