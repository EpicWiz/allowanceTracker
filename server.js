const express = require('express');
const bodyParser = require('body-parser');
const methOver = require('method-override');
const expHbars = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const db = require('./models');

const path = require('path');
//const formidable = require('formidable'); //uploading files (not installed)
const fs = require('fs'); //file system

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('./assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

//express sessions - manage user login sessions
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(methOver('_method'));

app.engine('handlebars', expHbars({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');

require('./controllers/html-routes.js')(app);
require('./controllers/api-routes.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/admin.js')(app);
require('./controllers/user.js')(app);

db.sequelize.sync({force: true}).then(function() {
  app.listen(PORT, function() {
    console.log('Listening on port: ' + PORT);
    require('./config/seeds.js')(app);
  });
});
