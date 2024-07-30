/*
 * app JavaScript code
 *
 * Author: Elise Chan (elisechan824)
 * Version: 2.0
 */
 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
const mongoose = require('mongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) =>
    res.send('<h1>Project2: elisechan824</h1>') // Home web page
);

const CS3744Schema = require("./model");
const router = express.Router();
app.use('/db', router);
router.route('/find').get( async (req, res) => {
  const response = await CS3744Schema.find();
  return res.status(200).json(response);
});

// insert new document to database
router.route('/postNew/').post( (req, res) => {
    CS3744Schema.create(req.body).then(
      (item) => {
        console.log(res.json(item))
    })
});

// update dataset by ID
router.route('/update/:id').post( (req, res) => {
  CS3744Schema.findById(req.params.id).then(function(items) {
    items.fileContent = req.body;
    items.save().then(item =>
      res.status(200).json(item));
  }) 
});

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

// Connect to MongoDB database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://student:cs3744@cluster0.6ywbyre.mongodb.net/CS3744');
mongoose.connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});


// module.exports = app;
app.listen(3000, () => console.log("listening on port 3000"));

