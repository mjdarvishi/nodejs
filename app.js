var createError = require('http-errors');
var express = require('express');
var path = require('path');
var body_parse = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var session = require('express-session');
const passport = require('passport');
var mongo = require('mongodb');
var db = require('monk')('localhost/auth')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');
var contactRouter = require('./routes/contact');
var profileRouter = require('./routes/profile');
var bookRouter = require('./routes/book');
var manageRouter = require('./routes/manage');
var galleryRouter = require('./routes/gallary');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(body_parse.json());
app.use(body_parse.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'anything', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.use(function (req, res, next) {
    res.locals.message = require('express-message');
    next();
});


app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();

});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contact', contactRouter);
app.use('/blog', blogRouter);
app.use('/profile', profileRouter);
app.use('/book', bookRouter);
app.use('/manage', manageRouter);
app.use('/gallery', galleryRouter);
app.get('/chat', function (req, res) {
    res.render('chat');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.locals.sub = function (len, text) {
    return text.substring(0, len);
};


module.exports = app;
