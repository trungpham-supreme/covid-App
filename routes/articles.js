var express = require('express');
var router = express.Router();
const Article = require('../models/article');

const request = require('request');





router.get('/info', (req,res)=>{
  request("https://covid19.mathdro.id/api", function (error, response, body){
  if(error){
    console.log("error");
  }else{
    var data = JSON.parse(body);
    var confirmed = data.confirmed.value;
    var recovered = data.recovered.value;
    var deaths = data.deaths.value;
    res.render('info',{confirmed: confirmed,recovered:recovered,deaths:deaths});
  }
  });
	
});

router.get('/tips', (req,res)=>{
  request("https://covid19.mathdro.id/api", function (error, response, body){
  if(error){
    console.log("error");
  }else{
    var data = JSON.parse(body);
    var confirmed = data.confirmed.value;
    var recovered = data.recovered.value;
    var deaths = data.deaths.value;
    res.render('tips',{confirmed: confirmed,recovered:recovered,deaths:deaths});
  }
  });
  
});


router.get('/news',async (req, res) =>{
  const articles = await Article.find().sort({
    createdAt: 'desc'
  }); 
  request("https://covid19.mathdro.id/api", function (error, response, body){
  if(error){
    console.log("error");
  }else{
    var data = JSON.parse(body);
    var confirmed = data.confirmed.value;
    var recovered = data.recovered.value;
    var deaths = data.deaths.value;
    res.render('news',{confirmed: confirmed,recovered:recovered,deaths:deaths, articles:articles});
  }
  });
});


router.get('/news/:slug',async (req, res)=>{
  const article = await Article.findOne({slug:req.params.slug});
  if(article == null) res.redirect('/');
  const articles = await Article.find().sort({
    createdAt: 'desc'
  });
  request("https://covid19.mathdro.id/api", function (error, response, body){
  if(error){
    console.log("error");
  }else{
    var data = JSON.parse(body);
    var confirmed = data.confirmed.value;
    var recovered = data.recovered.value;
    var deaths = data.deaths.value;
    res.render('show_news',{confirmed: confirmed,recovered:recovered,deaths:deaths,article: article,articles: articles});
  }
  });
 
});



module.exports = router;




