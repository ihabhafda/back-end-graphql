'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IDPSelectors extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  IDPSelectors.init(
    {
      school: DataTypes.STRING,
      studentName: DataTypes.STRING,
      studentIdNumber: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'IDPSelectors',
    },
  );
  return IDPSelectors;
};
