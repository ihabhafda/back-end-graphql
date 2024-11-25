'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SelfReflections extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
      });

      // this.hasMany(models.UploadFileSelfs, {
      //   foreignKey: 'selfId',
      //   as: 'upload',
      // });
    }
  }
  SelfReflections.init(
    {
      reflectionTitle: DataTypes.STRING,
      description: DataTypes.STRING,
      chooseFile: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'SelfReflections',
    },
  );
  return SelfReflections;
};
