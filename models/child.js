module.exports = function (sequelize, DataTypes){
  var Child = sequelize.define('Child', {
// Setting up basics, need to add more info
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 0
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true,
      default: 0
    }
  });

  Child.associate = function(models) {
    Child.belongsTo(models.User);
    Child.hasMany(models.Auto);
  };

  return Child;
};
