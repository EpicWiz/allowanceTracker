const isAuthenticated = require('../config/middleware/isAuthenticated');
const passport = require('../config/passport.js');
const db = require('../models');

module.exports = function(app) {

//SUBMIT LOGIN CREDS
  app.post('/api/login', function(request, response) {
    db.User.findOne({
      where: {
        email: request.body.email,
        password: request.body.password
      }
    })
    .then((data) => {
      response.redirect(307, '/auth/login');
    })
    .catch((error) => {
      console.log(error);
    });
  });

//AUTH Strategy
  app.post('/auth/login', passport.authenticate('local'), function(request, response) {
    response.redirect('/home');
  });

//Send to Appropriate user page
  app.get('/home', isAuthenticated, function(request, response) {

    if (request.user) {
//USER PAGE RENDER
    if (request.user.kind === 'user') {
      Promise.all([
        db.User.findOne({
          where: {
            email: request.user.email
          },
            include: [{model: db.Contact}]
        })
      ]).then((data) => {
          let hbsObject = {
            user: data[0]
          };
          response.render('welcome', hbsObject);
        }).catch((error) => {
          console.log(error);
        });

//ADMIN PAGE RENDER
    } else if (request.user.kind === 'admin') {
        Promise.all([
        db.Contact.findOne({
          where: {UserId: request.user.id}
        }),
        db.User.findOne({
          where: {id: request.user.id},
          include: [{model: db.Child}]
        })
        ])
        .then((data) => {
          console.log(JSON.stringify(data[1]));
          let hbsObject = {
            userInfo: data[0],
            user: data[1]
          };
          response.render('admin-welcome', hbsObject);
        }).catch((error) => {
          console.log(error);
        });
//WHAT DID YOU DO????
    } else {
      console.log('You\'ve either been banned or have no account. Try again later.');

    }
  } else { console.log('Login Failed');}
  });

  app.get('/logout', function(request, response) {
    request.logout();
    response.redirect('/');
  });

  app.post('/api/signup', function(request, response) {

    Promise.all([
      db.User.create({ //create user login credentials, classification, and Contact table association
        email: request.body.email.trim(),
        password: request.body.password.trim(),
        kind: 'user'
      })
    ])
    .then((data) => {
      Promise.all([ //get user data from db
        db.User.findAll({})
      ])
      .then((data) => {
        Promise.all([
          db.Contact.create({ //create contact info for new user
            first_name:  request.body.first_name.trim(),
            last_name:  request.body.last_name.trim(),
            gender:  request.body.gender.trim(),
            city:  request.body.city.trim(),
            state:  request.body.state,
            zip:  request.body.zip.trim(),
            phone_number:  request.body.phone.trim(),
            UserId: data[0][data[0].length - 1].id //association value for the User table (yes, i suck at sequelize and should learn how to use associations to make my life easier)
          })
        ])
      })
      .then((data) => {
        response.redirect('/login');
      }).catch((error) => {console.log(error)});
    })
    .catch((error) => {
    console.log(error);
    });
});

};
