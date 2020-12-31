const express = require('express');
const app = express();
var mongoose = require('mongoose');
const methodOverride = require('method-override');

 

//App use public folder
app.use(express.static("public")); 
 
//App set ejs
app.set('view engine','ejs');


//app use methodOverride
app.use(methodOverride('_method'));


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));


//Connect to MG
mongoose.connect('mongodb://localhost/covid',{
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

//set router
var home = require('./routes/home.js');
var hotline = require('./routes/hotline.js');
var articles = require('./routes/admin_articles.js')
var news = require('./routes/articles.js')



app.use('/',home);
app.use('/hotline',hotline);
app.use('/admin',articles);
app.use('/web',news);




app.listen(3000, function(){
	console.log('Server staring on port 3000');
});