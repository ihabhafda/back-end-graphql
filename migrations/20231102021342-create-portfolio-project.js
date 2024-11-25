'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PortfolioProjects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      projectName: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      dateCreated: {
        type: Sequelize.DATE,
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      keywords: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.ENUM('Personal', 'Professional', 'Academic'),
      },
      visibility: {
        type: Sequelize.ENUM('Public', 'Private', 'Members_ONly'),
      },
      editMyProject: {
        type: Sequelize.INTEGER,
      },
      uploadMedia: {
        type: Sequelize.STRING,
      },
      requestReferences: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PortfolioProjects');
  },
};
