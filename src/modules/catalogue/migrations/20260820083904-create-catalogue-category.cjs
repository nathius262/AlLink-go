'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('catalogue_categories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      slug: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },

      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },

      image: {
        allowNull: true,
        type: Sequelize.STRING,
      },

      is_active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      sort_order: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('catalogue_categories');
  },
};