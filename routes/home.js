var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');


process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;



router.get('/', function(req, res){
	request("https://covid19.mathdro.id/api", function (error, response, body){
  if(error){
    console.log("error");
  }else{
    var data = JSON.parse(body);
    var confirmed = data.confirmed.value;
    var recovered = data.recovered.value;
    var deaths = data.deaths.value;
    
    request('https://ncov.moh.gov.vn', function (error, response, html) {
      if(!error && response.statusCode == 200 ){
      const $ = cheerio.load (html);
      const siteHeading = $('.table-responsive').html();
      res.render('home', {siteHeading: siteHeading,confirmed: confirmed,recovered:recovered,deaths:deaths});
		}
	  }); 
  	}
  });
});


module.exports = router;