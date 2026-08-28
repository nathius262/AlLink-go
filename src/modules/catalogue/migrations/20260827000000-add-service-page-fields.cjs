'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('catalogue_categories', 'details', {
            type: Sequelize.JSON,
            allowNull: true,
        });

        await queryInterface.addColumn('catalogue_items', 'sort_order', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('catalogue_items', 'sort_order');
        await queryInterface.removeColumn('catalogue_categories', 'details');
    },
};