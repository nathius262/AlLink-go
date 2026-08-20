'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CatalogueItem extends Model {
    static associate(models) {
      CatalogueItem.belongsTo(models.CatalogueCategory, {
        foreignKey: 'category_id',
        as: 'category',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  CatalogueItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      item_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'service',
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'CatalogueItem',
      tableName: 'catalogue_items',
      timestamps: true,
      underscored: true,
    }
  );

  return CatalogueItem;
};