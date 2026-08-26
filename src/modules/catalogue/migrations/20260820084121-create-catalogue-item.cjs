'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('catalogue_items', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },

      category_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'catalogue_categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

      price: {
        allowNull: true,
        type: Sequelize.DECIMAL(12, 2),
      },

      image: {
        allowNull: true,
        type: Sequelize.STRING,
      },

      item_type: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'service',
      },

      is_active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      metadata: {
        allowNull: true,
        type: Sequelize.JSON,
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
    await queryInterface.dropTable('catalogue_items');
  },
};