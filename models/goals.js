'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Goals extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
      });

      // this.hasMany(models.TaskGoals, {
      //   foreignKey: 'goalsId',
      //   as: 'taskGoal',
      // });
    }
  }
  Goals.init(
    {
      goalName: DataTypes.STRING,
      description: DataTypes.STRING,
      tags: DataTypes.ARRAY(DataTypes.STRING),
      categories: DataTypes.STRING,
      relatedGoal: DataTypes.INTEGER,
      deadline: DataTypes.DATE,
      priority: DataTypes.STRING,
      portfolioItem: DataTypes.INTEGER,
      keepReminding: DataTypes.BOOLEAN,
      taskName: DataTypes.STRING,
      taskDescription: DataTypes.STRING,
      taskTime: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Goals',
    },
  );
  return Goals;
};
