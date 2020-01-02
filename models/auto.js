module.exports = function (sequelize, DataTypes){
  var Auto = sequelize.define('Auto', {
// Setting up basics, need to add more info
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      default: 'Custom'
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0
    },
    frequency: { //days
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0
    }
  });

  Auto.associate = function(models) {
    Auto.belongsTo(models.Child);
  };

  return Auto;
};
