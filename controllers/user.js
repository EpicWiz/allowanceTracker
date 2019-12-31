var bcrypt = require('bcrypt');
const isAuthenticated = require('../config/middleware/isAuthenticated');
const db = require('../models/index.js'); //see html-routes.js for more info

module.exports = function(app) {

// app.put('/update_user', isAuthenticated, function(request, response) {
//   db.Contact.update({
//     first_name: request.body.first_name.trim(),
//     last_name: request.body.last_name.trim(),
//     gender: request.body.gender,
//     city: request.body.city.trim(),
//     state: request.body.state,
//     zip: request.body.zip,
//     phone_number: request.body.phone_number
//   },{
//     where: {
//       UserId: request.user.id
//     }
//   }).then((data) => {
//     response.redirect('/profile');
//   }).catch((error) => {
//     console.log(error);
//   });
// });

// app.put('/user_email', isAuthenticated, function(request, response) {
//   db.User.update({
//     email: request.body.email.trim()
//   },{
//     where: {
//       id: request.user.id
//     }
//   }).then((data) => {
//     response.redirect('/profile');
//   }).catch((error) => {
//     console.log(error);
//   });
// });

// app.put('/user_pass', isAuthenticated, function(request, response) {
//   db.User.update({
//     password: bcrypt.hashSync(request.body.password.trim(), bcrypt.genSaltSync(10), null)
//   },{
//     where: {
//       id: request.user.id
//     }
//   }).then((data) => {
//     response.redirect('/profile');
//   }).catch((error) => {
//     console.log(error);
//   });
// });

};
