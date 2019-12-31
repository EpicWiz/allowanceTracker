const isAuthenticated = require('../config/middleware/isAuthenticated');
const db = require('../models/index.js'); //see html-routes.js for more info

module.exports = function(app) {









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
  app.put('/api/change', isAuthenticated, function(request, response) {
    db.Address.update({ //First update the address table
      name: request.body.name2.trim(),
      address: request.body.address2.trim()
      }, {
        where: {
          id: request.body.updateId
        }
    }).then((data) => {

          db.Food.update({ //then update the food table (food the address eats)
            food: request.body.address2.trim() + ' Food'
          }, {
            where: {
              AddressId: request.body.updateId
            }
          }).then((data) => { //then return to the main page (this will refresh the display with updated table data)
            response.redirect('back');
          }).catch((error) => {
            console.log(error);
          });

    }).catch((error) => {
      console.log(error);
    });
  });

  app.delete('/api/delete/:id', isAuthenticated, function(request, response) {
    Promise.all([
      db.Address.destroy({
        where: {
          id: request.params.id
        }
      }),
      db.Food.destroy({
        where: {
          AddressId: request.params.id
        }
      })
    ])
    .then((data) => {
                              // A possible out of scope basic explanation of Promise use.
                              // IF YOU WANTED TO ACCESS THE RETURN DATA FOLLOWING A DB QUERY USING A Promise.all([]) request
                              // REMEMBER THAT DATA IS NOW AN ARRAY. data[0] IS THE DATA FROM db.Address.destroy, and data[1]
                              // IS THE DATA FROM db.Food.destroy, and so on depending on your case. IF YOU WANTED TO RETURN DATA FROM A PROMISE LIKE THAT SHOWN
                              // ABOVE THROUGH AN EXPRESS-HANDLEBARS PAGE RENDER, USE THE FOLLOWING FORMAT.
                              // let hbsObject = {
                              //    address: data[0],
                              //    food: data[1]
                              // };
                              //  response.render('hbPage', hbsObject);
                              // addresss and food data will then be available on your page.
      response.redirect('back');
    }).catch((error) => {
      console.log( error);
    });
  });

};
