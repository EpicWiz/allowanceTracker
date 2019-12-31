const db = require('../models/index.js');

module.exports = function(app) {

  app.get('/', function(request, response) {
      response.render('index');
  });

  app.get('/login', function(request, response) {
      response.render('login');
  });

  app.get('/signup', function(request, response) {
      response.render('signup');
  });

};
