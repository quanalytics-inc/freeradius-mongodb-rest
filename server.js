var express = require('express'),
  app = express(),
  port = process.env.PORT || 4000,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  Accounting = require('./api/models/radius-accounting'),
  Users = require('./api/models/users'),
  Profiles = require('./api/models/profiles'),
  config = require('./config');

const { seedDatabase } = require('./api/seeds/seed.js');
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));

var radius = require('./api/routes/radius');
radius(app);

app.listen(port);

console.log('FreeRADIUS REST API Server started on: ' + port);
// seedDatabase();
