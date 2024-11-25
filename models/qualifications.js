'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Qualifications extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Qualifications.init(
    {
      qualificationName: DataTypes.STRING,
      type: DataTypes.STRING,
      institutionUniversity: DataTypes.STRING,
      status: DataTypes.STRING,
      subjectCompleted: DataTypes.ARRAY(DataTypes.STRING),
      subjectInProgress: DataTypes.ARRAY(DataTypes.STRING),
      grade: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      badgeUrl: DataTypes.STRING,
      attachments: DataTypes.ARRAY(DataTypes.STRING),
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Qualifications',
    },
  );

  return Qualifications;
};
