const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('statuses', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'statuses',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "statuses_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
