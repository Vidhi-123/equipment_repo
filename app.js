var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var inventoryRouter=require('./routes/sportsinventory_router');
var equipment=require('./routes/equipment_router');
var equipmentReturn=require('./routes/equipment_Return_Entry');

var crypto = require ('crypto');



var app = express();

app.get("/decryptID/:id",(req,res) => {

  
  console.log(req.params.id);
  let id = req.params.id;
  var mykey = crypto.createDecipher('aes-128-cbc', 'dascanner');
  var mystr = mykey.update(id, 'hex', 'utf8')
  mystr += mykey.final('utf8');

  res.send(mystr);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inventory',inventoryRouter);
app.use('/equipment',equipment);
app.use('/equipmentReturn',equipmentReturn);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
