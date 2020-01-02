// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
var bcrypt = require("bcrypt");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kind: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    }
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  // User.hook("beforeCreate", function(user) {
  //   user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  // }); THE HOOK FUNCTION HAS CHANGED

  User.beforeCreate(function (user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  // return Promise.try(function () {
  //   if (user.accessLevel > 10 && user.username !== "Boss") {
  //     throw new Error("You can't grant this user an access level above 10!")
  //   }
  //   return user.getRole().then(function (role) {
  //     if (role.key !== 'admin') throw new Error('Admin needed');
  //     options.isAdmin = true;
  //   });
  // });
});

  User.associate = function(models) {
    User.hasOne(models.Contact);
    User.hasMany(models.Child);
  };

  return User;
};
