'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PortfolioFolders extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'users',
      });

      this.belongsToMany(models.PortfolioProjects, {
        through: 'projectFolders',
        foreignKey: 'folderId',
        as: 'project',
      });
    }
  }
  PortfolioFolders.init(
    {
      folderName: DataTypes.STRING,
      addCover: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'PortfolioFolders',
    },
  );
  return PortfolioFolders;
};
