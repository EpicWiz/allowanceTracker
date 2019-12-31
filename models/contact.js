module.exports = function (sequelize, DataTypes){
  var Contact = sequelize.define('Contact', {
// Setting up basics, need to add more info
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      default: "unknown"
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2]
      }
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  });

  Contact.associate = function(models) {
    Contact.belongsTo(models.User);
  };

  return Contact;
};
