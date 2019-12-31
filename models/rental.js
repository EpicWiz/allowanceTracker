module.exports = function (sequelize, DataTypes){
  var Rental = sequelize.define('Rental', {
// Setting up basics, need to add more info
    street_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    street_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
      default: ""
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
        len: [1]
      }
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Rental.associate = function(models) {
    Rental.belongsTo(models.User);
  };

  return Rental;
};
