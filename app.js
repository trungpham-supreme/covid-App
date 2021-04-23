const express = require('express');
const app = express();
var mongoose = require('mongoose');
const methodOverride = require('method-override');
var passport = require('passport');
var expressValidator = require('express-validator');
const flash = require('connect-flash');
var path = require('path');
const session = require('express-session');
const http = require('http').createServer(app);
var request = require('request');
var cheerio = require('cheerio');



const PORT = process.env.PORT || 3000


//App use public folder
app.use(express.static("public")); 
 
//App set ejs
app.set('views', path.join(__dirname, 'views'));
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

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);


// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//set router
var home = require('./routes/home.js');
var hotline = require('./routes/hotline.js');
var articles = require('./routes/admin_articles.js');
var news = require('./routes/articles.js');
var user = require('./routes/user.js');
var chat = require('./routes/chat.js');
var accounts = require('./routes/admin_account.js');

app.get('*', function(req,res,next) {
   res.locals.user = req.user || null;
   next();
});




app.use('/',home);
app.use('/hotline',hotline);
app.use('/admin',articles);
app.use('/web',news);
app.use('/users',user);
app.use('/chat',chat);
app.use('/accounts',accounts);

// Socket 
const io = require('Socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})





http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})