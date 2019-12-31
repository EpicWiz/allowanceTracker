let db = require('../models/');

module.exports = function() {

function first() {
  db.User.create({
    email: 'ericjric@gmail.com',
    password: 'password',
    kind: 'admin'
  }).then(data => {
    second();
  });
  };


function second() {
  db.Contact.create({
    first_name:  'Eric',
    last_name:  'Rice',
    gender:  'male',
    zip:  90266,
    city:  'Los Angeles',
    state:  'california',
    phone_number:  8183399925,
    UserId: 1
  }).then(function() {
    third();
  });
}

function third() {
  db.User.create({
    email: 'email@email.com',
    password: 'password',
    kind: 'user'
  }).then(function() {
    fourth();
  });
}

function fourth() {
  db.Contact.create({
    first_name:  'Erlich',
    last_name:  'Bachman',
    gender: 'male',
    zip:  90210,
    city:  'Sydney',
    state:  'california',
    phone_number:  1234567890,
    UserId: 2
  }).then(function() {
    fifth();
  });
}

function fifth() {
  db.User.create({
    email: 'email2@email.com',
    password: 'password',
    kind: 'user'
  }).then(function() {
    sixth();
  });
}

function sixth() {
  db.Contact.create({
    first_name: 'Eva',
    last_name:  'Rice',
    gender: 'female',
    zip:  12345,
    city: 'Manhattan Beach',
    state: 'texas',
    phone_number: 0987654321,
    UserId: 3
  }).then(function() {
    seventh();
  });
}

function seventh() {
  Promise.all([
  db.Rental.create({
    UserId: 1,
    street_number: 1209,
    street_name: 'Manhattan Avenue',
    unit: '#312',
    city: 'Manhattan Beach',
    state: 'california',
    zip: 90266
  }),
  db.Rental.create({
    UserId: 1,
    street_number: 2308,
    street_name: 'Pine Avenue',
    city: 'Manhattan Beach',
    state: 'california',
    zip: 90266
  }),
  db.Rental.create({
    UserId: 1,
    street_number: 931,
    street_name: 'Monterey Boulevard',
    city: 'Hermosa Beach',
    state: 'california',
    zip: 90254
  })
]).then((data) => {
  //do nothing
}).catch((error) => {
  console.log(error);
});
}

first();

};
