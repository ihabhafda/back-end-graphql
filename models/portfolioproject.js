'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PortfolioProjects extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'users',
      });

      this.belongsToMany(models.PortfolioFolders, {
        through: 'projectFolders',
        foreignKey: 'projectId',
        as: 'folder',
      });
    }
  }
  PortfolioProjects.init(
    {
      projectName: DataTypes.STRING,
      description: DataTypes.STRING,
      dateCreated: DataTypes.DATE,
      tags: DataTypes.ARRAY(DataTypes.STRING),
      keywords: DataTypes.STRING,
      category: DataTypes.STRING,
      visibility: DataTypes.STRING,
      editMyProject: DataTypes.INTEGER,
      uploadMedia: DataTypes.STRING,
      requestReferences: DataTypes.STRING,
      url: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'PortfolioProjects',
    },
  );
  return PortfolioProjects;
};
``;
