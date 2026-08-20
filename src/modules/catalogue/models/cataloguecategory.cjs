'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CatalogueCategory extends Model {
    static associate(models) {
      CatalogueCategory.hasMany(models.CatalogueItem, {
        foreignKey: 'category_id',
        as: 'items',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  CatalogueCategory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'CatalogueCategory',
      tableName: 'catalogue_categories',
      timestamps: true,
      underscored: true,
    }
  );

  return CatalogueCategory;
};