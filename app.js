var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
const path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

var uploadRouter = require('./routes/upload');
var statusRouter = require('./routes/status');

const db = require("./db/models/index");

var app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/upload', uploadRouter);
app.use('/status', statusRouter);
// app.use('/webhook', webhookRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

db.sequelize.sync({ force: true });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
});

module.exports = app;
