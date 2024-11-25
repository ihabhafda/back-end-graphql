'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermissionConsents extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'users',
      });
    }
  }
  PermissionConsents.init(
    {
      editor: DataTypes.INTEGER,
      access: DataTypes.STRING,
      specifyTime: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'PermissionConsents',
    },
  );
  return PermissionConsents;
};
