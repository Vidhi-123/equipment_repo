var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var equipment=require('./routes/equipment_router');

var scanqr=require('./routes/scanqr_router');
var qrcode=require('./routes/qrcode_router');
var lib_tmp=require('./routes/lib_tmp_router');


var student_home=require('./routes/student_homepage_router');
var student_header=require('./routes/header_router');
var time1=require('./timer');

var crypto = require ('crypto');
const session = require('express-session');
const passport = require('passport');



var app = express();


var sessionStore = new session.MemoryStore;

app.use(session({
    cookie: { maxAge: 6000000 },
    store: sessionStore,
    saveUninitialized: false,
    resave: 'true', //resaves session if time limit ended
    secret: 'secret'
}));
app.get('/change_password/:id',function(req,res,next){
  res.render('change_password',{
    id:req.params.id
  })
})

app.use(passport.initialize());
app.use(passport.session());
require('./passport-config')(passport);


const userRoute = require("./routes/user_routes");
const homeRoute = require("./routes/homepage_router")(passport);



app.get("/generateqr",function(req,res,next){
  res.render('qr_code');
})

// app.get("/student_home",function(req,res,next){
//   res.render('/student_homepage');
// })

app.get('/',(req,res,next)=>{
  
  time1.f2();
  res.render('welcome');
})
app.get("/decryptID/:id",(req,res) => {

  

  let id = req.params.id;
  var mykey = crypto.createDecipher('aes-128-cbc', 'dascanner');
  var mystr = mykey.update(id, 'hex', 'utf8')
  mystr += mykey.final('utf8');

  res.send(mystr);
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.get('/',(req,res,next)=>{
  
  
//   res.render('homepage');
// })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/index', indexRouter);
app.use('/users', usersRouter);

app.use('/equipment',equipment);

app.use('/scanqr',scanqr);
app.use('/student_homepage1',student_home);
app.use("/users", userRoute);
app.use("/student_header", student_header);
app.use("/home",homeRoute);


app.use('/lib_tmp',lib_tmp);
app.use('/qrcode',qrcode);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
