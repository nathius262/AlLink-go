'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('testimonies', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      role: {
        allowNull: true,
        type: Sequelize.STRING,
      },

      company: {
        allowNull: true,
        type: Sequelize.STRING,
      },

      content: {
        allowNull: false,
        type: Sequelize.TEXT,
      },

      image: {
        allowNull: true,
        type: Sequelize.STRING,
      },

      rating: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },

      is_featured: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('testimonies');
  },
};