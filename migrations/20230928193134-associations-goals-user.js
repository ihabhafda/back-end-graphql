'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Goals', 'userId', {
      type: Sequelize.INTEGER,
      References: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      // TODO: CASCADE means : if parent  is delete all it's  children will be deleted
      // TODO: SET NULL : if parent is delete all it's children will be set to null
    });
  },

  async down(queryInterface, Sequelize) {},
};
