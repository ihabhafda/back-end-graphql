'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skills extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
      });

      // this.hasMany(models.MapSkills, {
      //   foreignKey: 'skillId',
      //   as: 'mapSkill',
      // });
    }
  }
  Skills.init(
    {
      skillName: DataTypes.STRING,
      competencyLevel: DataTypes.STRING,
      category: DataTypes.STRING,
      description: DataTypes.STRING,
      map: DataTypes.ENUM('EDUCATION', 'EXPERIENCE', 'PORTFOLIO'),
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Skills',
    },
  );

  return Skills;
};
