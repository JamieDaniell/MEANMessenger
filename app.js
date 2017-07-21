var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

/////////////
//// Routes
/////////////
var appRoutes = require('./routes/app');
var messageRoutes = require('./routes/messages');
var userRoutes = require('./routes/user')
/////////////

var app = express();

mongoose.connect('mongodb://localhost:27017/angular-app', { useMongoClient: true });
// view engine setup
// set the views folder
app.set('views', path.join(__dirname, 'views'));
// how to parse html and templates
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// use body parser for req and res
// == use on each request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// set the directory which the browser / client can see
// static files
app.use(express.static(path.join(__dirname, 'public')));

//middleware solves problem when there are more than one server 
//need to idnetify which server
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

// use the appRoutes forwards request to app.js
app.use('/user' ,userRoutes); 
app.use('/message', messageRoutes);
app.use('/', appRoutes);



// catch 404 and forward to error handler
// where no route is found always start angular application
app.use(function (req, res, next) { 
    return res.render('index');
});

module.exports = app;
