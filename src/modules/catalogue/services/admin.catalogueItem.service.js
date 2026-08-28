import db from '../../../models/index.cjs';

const { CatalogueItem, CatalogueCategory } = db;


/**
 * Find all catalogue items
 */
export const findAll = async ({ limit, offset }) => {
    try {

        const {
            rows: items,
            count: totalItems
        } = await CatalogueItem.findAndCountAll({

            limit,
            offset,

            distinct: true,

            include: [
                {
                    model: CatalogueCategory,
                    as: 'category',
                    attributes: [
                        'id',
                        'name',
                        'slug'
                    ]
                }
            ],

            order: [
                ['created_at', 'DESC'],
                ['updated_at', 'DESC']
            ]

        });

        return {
            items,
            totalItems,
            totalPages: Math.ceil(totalItems / limit)
        };

    } catch (error) {

        console.error(error);

        throw new Error(
            'Error fetching catalogue items: ' + error.message
        );
    }
};

/**
 * Find all catalogue items by category
 */
export const findAllByCategory = async ({ limit, offset, category_id }) => {
    try {

        const {
            rows: items,
            count: totalItems
        } = await CatalogueItem.findAndCountAll({
            where: {
                category_id: category_id
            },
            limit,
            offset,

            distinct: true,


            order: [
                ['created_at', 'DESC'],
                ['updated_at', 'DESC']
            ]

        });

        return {
            items,
            totalItems,
            totalPages: Math.ceil(totalItems / limit)
        };

    } catch (error) {

        console.error(error);

        throw new Error(
            'Error fetching catalogue items: ' + error.message
        );
    }
};


/**
 * Find catalogue item by ID
 */
export const findById = async (id) => {
    try {

        const item = await CatalogueItem.findByPk(id, {

            include: [
                {
                    model: CatalogueCategory,
                    as: 'category',
                    attributes: [
                        'id',
                        'name',
                        'slug'
                    ]
                }
            ]

        });

        if (!item) {
            throw new Error('Catalogue item not found');
        }

        return item;

    } catch (error) {

        console.error(error);

        throw new Error(
            'Error fetching catalogue item: ' + error.message
        );
    }
};


/**
 * Find item by slug
 */
export const findBySlug = async (slug) => {
    try {

        return await CatalogueItem.findOne({
            where: { slug }
        });

    } catch (error) {

        console.error(error);

        throw new Error(
            'Error checking catalogue item slug: ' + error.message
        );
    }
};


/**
 * Create catalogue item
 */
export const create = async (data) => {
    try {

        const {
            category_id,
            name,
            slug,
            description,
            price,
            sort_order,
            is_active,
            image,
            metadata
        } = data;

        if (!category_id) {
            throw new Error('Catalogue category is required');
        }

        if (!name) {
            throw new Error('Catalogue item name is required');
        }

        if (!slug) {
            throw new Error('Catalogue item slug is required');
        }


        /*
         * Check whether the category exists
         */
        const category = await CatalogueCategory.findByPk(category_id);

        if (!category) {
            throw new Error('Selected catalogue category does not exist');
        }


        /*
         * Prevent duplicate slug
         */
        const existing = await CatalogueItem.findOne({
            where: { slug }
        });

        if (existing) {
            throw new Error(
                'A catalogue item with this slug already exists'
            );
        }


        return await CatalogueItem.create({
            category_id,
            name,
            slug,
            description,
            price,
            sort_order,
            is_active,
            image,
            metadata
        });

    } catch (error) {

        console.error(error);

        throw new Error(
            'Error creating catalogue item: ' + error.message
        );
    }
};


/**
 * Update catalogue item
 */
export const update = async (id, data) => {
    try {

        const item = await CatalogueItem.findByPk(id);

        if (!item) {
            throw new Error('Catalogue item not found');
        }


        /*
         * If slug is being changed,
         * make sure it isn't already being used.
         */
        if (data.slug && data.slug !== item.slug) {

            const existing = await CatalogueItem.findOne({
                where: {
                    slug: data.slug
                }
            });

            if (existing) {
                throw new Error(
                    'A catalogue item with this slug already exists'
                );
            }
        }


        /*
         * Validate category if changed
         */
        if (data.category_id) {

            const category = await CatalogueCategory.findByPk(
                data.category_id
            );

            if (!category) {
                throw new Error(
                    'Selected catalogue category does not exist'
                );
            }
        }


        return await item.update(data);

    } catch (error) {

        console.error(error);

        throw new Error(
            'Error updating catalogue item: ' + error.message
        );
    }
};


/**
 * Delete catalogue item
 */
export const destroy = async (id) => {
    try {

        const item = await CatalogueItem.findByPk(id);

        if (!item) {
            throw new Error('Catalogue item not found');
        }

        return await item.destroy();

    } catch (error) {

        console.error(error);

        throw new Error(
            'Error deleting catalogue item: ' + error.message
        );
    }
};


/**
 * Get categories for catalogue item forms
 */
export const getCategories = async () => {
    try {

        return await CatalogueCategory.findAll({

            where: {
                is_active: true
            },

            attributes: [
                'id',
                'name',
                'slug'
            ],

            order: [
                ['name', 'ASC']
            ]

        });

    } catch (error) {

        console.error(error);

        throw new Error(
            'Error fetching catalogue categories: ' + error.message
        );
    }
};