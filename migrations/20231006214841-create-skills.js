'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Skills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      skillName: {
        type: Sequelize.STRING,
      },
      competencyLevel: {
        type: Sequelize.ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
      },
      category: {
        type: Sequelize.ENUM(
          'TECHNICAL_SKILLS',
          'MANAGEMENT_SKILLS',
          'LIFE_SKILLS',
        ),
      },
      description: {
        type: Sequelize.STRING,
      },
      map: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Skills');
  },
};
