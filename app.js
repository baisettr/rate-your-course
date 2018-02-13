const express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var request = require('request');
var favicon = require('serve-favicon');

var path = require('path');

var MongoStore = require('connect-mongo')(session);
var mongoOptions = require('./config/mongoDb.json');
var mongoose = require('mongoose');

var index = require('./routes/index');
var univ = require('./routes/university');
var dept = require('./routes/department');
var course = require('./routes/course');
var review = require('./routes/review');


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/logo.png'));

//app.use(express.static(__dirname + '/views'));
//app.use(express.static(__dirname + '/scripts'));

mongoose.connect('mongodb://' + mongoOptions.host + '/' + mongoOptions.db);
mongoose.Promise = global.Promise;

app.use(session({
    secret: 'ryc',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore(mongoOptions)
}));

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.use('/', index);
app.use('/univ', univ);
app.use('/univ/dept', dept);
app.use('/univ/dept/course', course);
app.use('/univ/dept/course/review', review);

app.use(function (req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;