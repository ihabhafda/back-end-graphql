'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Qualifications, {
        foreignKey: 'userId',
        as: 'qualifications',
      });

      this.hasMany(models.Goals, {
        foreignKey: 'userId',
        as: 'goals',
      });

      this.hasMany(models.Skills, {
        foreignKey: 'userId',
        as: 'skills',
      });

      this.hasMany(models.SelfReflections, {
        foreignKey: 'userId',
        as: 'selfReflections',
      });

      this.hasMany(models.PermissionConsents, {
        foreignKey: 'userId',
        as: 'permissions',
      });

      this.hasMany(models.PortfolioFolders, {
        foreignKey: 'userId',
        as: 'portfolioFolders',
      });

      this.hasMany(models.PortfolioProjects, {
        foreignKey: 'userId',
        as: 'portfolioProjects',
      });

      this.hasMany(models.Pathways, {
        foreignKey: 'userId',
        as: 'pathways',
      });

      this.hasMany(models.IDPSelectors, {
        foreignKey: 'userId',
        as: 'idp',
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      grade: DataTypes.STRING,
      schoolCode: DataTypes.STRING,
      usi: DataTypes.STRING,
      microsoftId: DataTypes.STRING,
      googleId: DataTypes.STRING,
      role: DataTypes.STRING,
      agreeToTerms: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Users',
    },
  );
  return User;
};
