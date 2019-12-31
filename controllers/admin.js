var bcrypt = require('bcrypt');
const isAuthenticated = require('../config/middleware/isAuthenticated');
const db = require('../models/index.js'); //see html-routes.js for more info

module.exports = function(app) {

  //Super Admin Manual User Password Update (doubles for Admin function)
  app.put('/update_pass/:id', isAuthenticated, function(request, response) {

    db.User.update({
      password: bcrypt.hashSync(request.body.password.trim(), bcrypt.genSaltSync(10), null)
    }, {
      where: {
        id: request.params.id
      }
    }).then((data) => {
      response.redirect('/manage_users');
    }).catch((error) => {
      console.log(error);
    });

  });

  //Super Admin Manual User Details Update
  app.put('/sa_update_user/:id', isAuthenticated, function(request, response) {

    Promise.all([
      db.User.update({
        email: request.body.email.trim(),
        kind: request.body.kind
      }, {
        where: {
          id: request.params.id
        }
      }),
      db.Contact.update({
        first_name: request.body.first_name.trim(),
        last_name: request.body.last_name.trim(),
        gender: request.body.gender,
        city: request.body.city.trim(),
        state: request.body.state,
        zip: request.body.zip,
        phone_number: request.body.phone_number
      },{
        where: {
          UserId: request.params.id
        }
      })
    ]).then((data) => {
          response.redirect('/manage_users');
    }).catch((error) => {
      console.log(error);
    });
  });

  //Navigate to Super Admin Manage Users page with relevant data request.
  app.get('/manage_users', isAuthenticated, function(request, response) {
    Promise.all([db.User.findAll({
      where: {
        kind: 'admin'
      },
      include: [{model: db.Contact}]
    }),
    db.User.findAll({
      where: {
        kind: 'user'
      },
      include: [{model: db.Contact}]
    }),
    db.Contact.findOne({
      where: {
        id: request.user.id
      }
    })
  ])
    .then((data) => {
      let hbsObject = {
        admin: data[0],
        user: data[1],
        userInfo: data[2]
      };
      response.render('manage_users', hbsObject);
    }).catch((error) => {
      console.log(error);
    });

  });

  //Super Admin, create users
  app.post('/sa_create_user', isAuthenticated, function(request, response) { //Super Admin, Create Users
    Promise.all([
      db.User.create({ //create user login details and classification
        email: request.body.email.trim(),
        password: request.body.password.trim(), //.create automatically hashes password based on model specs (delete comment later)
        kind: request.body.kind
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
            gender:  request.body.gender,
            city:  request.body.city.trim(),
            state:  request.body.state,
            zip:  request.body.zip.trim(),
            phone_number:  request.body.phone_number.trim(),
            UserId: data[0][data[0].length - 1].id //association value for the User table (get id from last user created--> which is this user)
          })
        ])
      })
      .then((data) => {
        response.redirect('/manage_users');
      }).catch((error) => {console.log(error)});
    })
    .catch((error) => {
    console.log(error);
    });

  });

  //DELETE user data from database
  app.delete('/delete_user/:id', isAuthenticated, function(request, response) {

    Promise.all([
      db.User.destroy({
        where: {
          id: request.params.id
        }
      }),
      db.Contact.destroy({
        where: {
          UserId: request.params.id
        }
      })
    ]).then((data) => {
      response.redirect('/manage_users');
    }).catch((error) => {
      console.log(error);
    });

  });



};


//Example with alias and filter (where)
// Albums.findAll({
//   include: [{
//     model: Artists,
//     as: 'Singer',
//     where: { name: 'Al Green' } //
//   }]
// })
// .then(albums => console.log(albums))
// .catch(console.error)



//To include multiple associations
// Album.findAll({
//   include: [
//     {
//       model: Artist,
//       as: 'Singer',
//     },
//     {
//       model: Genre
//     }
// ]



//I've exaggerated the indentation in an attempt to make it more readable.
//Try not to nest more than 2-3 queries in this way or it will be very difficult to read
//For both you and others.

  // app.post('/api/addAddress', function(request, response) {
  //   let apt = (request.body.apt !== undefined) ? request.body.apt.trim() : NULL;
  //   db.Address.create({
  //     streetNumber: request.body.streetNumber,
  //     streetName: request.body.streetName.trim(),
  //     apt: apt,
  //     city: request.body.city.trim(),
  //     state: request.body.state.trim(),
  //     zip: request.body.zip
  //   })
  //   .then((data) => {
  //     response.redirect('back');
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // });

  // app.post('/api/addNew', function(request, response) {
  //       db.Address.create({ //create the new address
  //         name: request.body.name.trim(),
  //         address: request.body.address.trim()
  //       })
  //     .then((data) => {
  //               db.Address.findAll({ //find the last address created
  //                 where: {
  //                   name: request.body.name.trim(),
  //                   address: request.body.address.trim()
  //                 },
  //                 order: [
  //                   ['id', 'DESC']
  //                 ],
  //                 limit: 1
  //               })
  //               .then((data) => {
  //                         db.Food.create({ //create the address food for the created address
  //                           food: request.body.address + ' Food',
  //                           AddressId: data[0].id
  //                         }).then((error) => {
  //                           response.redirect('back');
  //                         }).catch((error) => {
  //                           console.log(error);
  //                         });
  //               })
  //               .catch((error) => {
  //                 console.log(error);
  //             });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });

//NOTE: Try not to nest too many db queries in one request. More than 2-3 will start making it hard to read.
// The example below is already starting to look like a mess as you can see. You can either try using a promise,
// or just redirect to a separate route to continue.
//I've exaggerated the indentation to attempt making it more readable.


  // app.delete('/api/delete/:id', function(request, response) {
  //   Promise.all([
  //     db.Address.destroy({
  //       where: {
  //         id: request.params.id
  //       }
  //     }),
  //     db.Food.destroy({
  //       where: {
  //         AddressId: request.params.id
  //       }
  //     })
  //   ])
  //   .then((data) => {
  //                             // A possible out of scope basic explanation of Promise use.
  //                             // IF YOU WANTED TO ACCESS THE RETURN DATA FOLLOWING A DB QUERY USING A Promise.all([]) request
  //                             // REMEMBER THAT DATA IS NOW AN ARRAY. data[0] IS THE DATA FROM db.Address.destroy, and data[1]
  //                             // IS THE DATA FROM db.Food.destroy, and so on depending on your case. IF YOU WANTED TO RETURN DATA FROM A PROMISE LIKE THAT SHOWN
  //                             // ABOVE THROUGH AN EXPRESS-HANDLEBARS PAGE RENDER, USE THE FOLLOWING FORMAT.
  //                             // let hbsObject = {
  //                             //    address: data[0],
  //                             //    food: data[1]
  //                             // };
  //                             //  response.render('hbPage', hbsObject);
  //                             // addresss and food data will then be available on your page.
  //     response.redirect('back');
  //   }).catch((error) => {
  //     console.log( error);
  //   });
  // });
