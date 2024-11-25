'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Goals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      goalName: {
        type: Sequelize.STRING,
      },
      categories: {
        type: Sequelize.ENUM('PERSONAL', 'PROFESSIONAL', 'ACADEMIC'),
      },
      description: {
        type: Sequelize.STRING,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      relatedGoal: {
        type: Sequelize.INTEGER,
      },
      deadline: {
        type: Sequelize.DATE,
      },
      priority: {
        type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH'),
      },
      portfolioItem: {
        type: Sequelize.INTEGER,
      },
      keepReminding: {
        type: Sequelize.BOOLEAN,
      },
      taskName: {
        type: Sequelize.STRING,
      },
      taskDescription: {
        type: Sequelize.STRING,
      },
      taskTime: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Goals');
  },
};
