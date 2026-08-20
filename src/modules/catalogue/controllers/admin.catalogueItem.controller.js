import * as service
    from '../services/admin.catalogueItem.service.js';

import cloudinary
    from '../../../config/cloudinaryConfig.js';

import {
    getPublicIdFromUrl
} from '../../../utils/utils.js';


/**
 * Catalogue Item List
 */
export const findAll = async (req, res) => {

    const {
        page,
        limit,
        offset
    } = req.pagination;

    try {

        const data = await service.findAll({
            limit,
            offset
        });

        res.status(200).render(
            './admins/item/item_list',
            {
                success: true,

                pageTitle: 'Catalogue Items',

                PageTitle: 'Catalogue',

                layout: 'admin',

                items: data.items,

                totalItems: data.totalItems,

                totalPages: data.totalPages,

                currentPage: page
            }
        );

    } catch (err) {

        console.error(err);

        res.status(500).render(
            'errors/500',
            { error: err }
        );
    }
};


/**
 * Render create page
 */
export const renderCreate = async (req, res) => {

    try {

        const categories =
            await service.getCategories();

        res.status(200).render(
            './admins/item/item_create',
            {
                pageTitle: 'Create Catalogue Item',

                PageTitle: 'Catalogue',

                layout: 'admin',

                categories
            }
        );

    } catch (err) {

        console.error(err);

        res.status(500).render(
            'errors/500',
            { error: err }
        );
    }
};


/**
 * Create catalogue item
 */
export const create = async (req, res) => {

    try {

        const data = {
            ...req.body
        };


        /*
         * Image upload
         */
        if (req.files?.image?.[0]) {

            const file = req.files.image[0];

            const result =
                await cloudinary.uploader.upload(
                    file.path,
                    {
                        folder: 'allink-go/item/items'
                    }
                );

            data.image = result.secure_url;
        }


        /*
         * Parse metadata if submitted as JSON
         */
        if (typeof data.metadata === 'string') {

            try {

                data.metadata =
                    JSON.parse(data.metadata);

            } catch {

                data.metadata = {};
            }
        }


        /*
         * Parse price
         */
        if (
            data.price === '' ||
            data.price === undefined
        ) {

            data.price = null;

        } else {

            data.price = Number(data.price);
        }


        /*
         * Parse status
         */
        data.is_active =
            data.is_active === '1' ||
            data.is_active === true;


        const item =
            await service.create(data);


        res.status(201).json({

            success: true,

            data: item,

            redirectTo:
                '/admin/catalogue/item',

            message:
                'Catalogue item created successfully'

        });

    } catch (err) {

        console.error(err);

        res.status(400).json({

            success: false,

            error: err.message

        });
    }
};


/**
 * View / edit catalogue item
 */
export const findById = async (req, res) => {

    try {

        const [
            item,
            categories
        ] = await Promise.all([

            service.findById(
                req.params.id
            ),

            service.getCategories()

        ]);


        res.status(200).render(
            './admins/item/item_update',
            {

                success: true,

                pageTitle:
                    'Update Catalogue Item',

                PageTitle:
                    'Catalogue',

                layout: 'admin',

                item,

                categories

            }
        );

    } catch (err) {

        console.error(err);

        res.status(404).render(
            'errors/404',
            { error: err }
        );
    }
};


/**
 * Update catalogue item
 */
export const update = async (req, res) => {

    try {

        const data = {
            ...req.body
        };


        /*
         * Upload replacement image
         */
        if (req.files?.image?.[0]) {

            const file =
                req.files.image[0];


            /*
             * Get existing item
             * so we can remove the old image
             */
            const item =
                await service.findById(
                    req.params.id
                );


            if (item.image) {

                const publicId =
                    getPublicIdFromUrl(
                        item.image
                    );

                if (publicId) {

                    await cloudinary.uploader.destroy(
                        publicId
                    );
                }
            }


            const result =
                await cloudinary.uploader.upload(
                    file.path,
                    {
                        folder:
                            'allink-go/item/items'
                    }
                );


            data.image =
                result.secure_url;
        }


        /*
         * Keep existing image
         * when no replacement is uploaded.
         */


        if (
            typeof data.metadata === 'string'
        ) {

            try {

                data.metadata =
                    JSON.parse(data.metadata);

            } catch {

                data.metadata = {};
            }
        }


        if (
            data.price === '' ||
            data.price === undefined
        ) {

            data.price = null;

        } else {

            data.price =
                Number(data.price);
        }


        data.is_active =
            data.is_active === '1' ||
            data.is_active === true;


        const item =
            await service.update(
                req.params.id,
                data
            );

        res.status(200).json({

            success: true,

            data: item,

            redirectTo:
                `/admin/catalogue/item/${req.params.id}`,

            message:
                'Catalogue item updated successfully'

        });

    } catch (err) {

        console.error(err);

        res.status(400).json({

            success: false,

            error: err.message

        });
    }
};


/**
 * Delete catalogue item
 */
export const destroy = async (req, res) => {

    try {

        const item =
            await service.findById(
                req.params.id
            );


        /*
         * Remove Cloudinary image
         */
        if (item.image) {

            const publicId =
                getPublicIdFromUrl(
                    item.image
                );

            if (publicId) {

                await cloudinary.uploader.destroy(
                    publicId
                );
            }
        }


        await service.destroy(
            req.params.id
        );


        res.status(200).json({

            success: true,

            message:
                'Catalogue item deleted successfully',

            redirectTo:
                '/admin/catalogue/item'

        });

    } catch (err) {

        console.error(err);

        res.status(400).json({

            success: false,

            error: err.message

        });
    }
};