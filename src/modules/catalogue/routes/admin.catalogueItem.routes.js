import express from 'express';

import * as controller
    from '../controllers/admin.catalogueItem.controller.js';

import {
    withPagination
} from '../../../middlewares/paginations.js'
import upload
    from '../../../config/multerConfig.js';

import setSection
    from '../../../middlewares/uploadLocation.js';


const router = express.Router();


/*
|--------------------------------------------------------------------------
| Catalogue Item Routes
|--------------------------------------------------------------------------
*/


/*
 * List
 */
router
    .route('/')
    .get(
        withPagination(20),
        controller.findAll
    )

    /*
     * Create
     */
    .post(

        setSection('catalogue/items'),

        upload.fields([
            {
                name: 'image',
                maxCount: 1
            }
        ]),

        controller.create
    );


/*
 * Create page
 */
router
    .route('/create')
    .get(
        controller.renderCreate
    )

    /*
     * Create
     */
    .post(

        setSection('catalogue/items'),

        upload.fields([
            {
                name: 'image',
                maxCount: 1
            }
        ]),

        controller.create
    );



/*
 * View / Update
 */
router
    .route('/:id')

    .get(
        controller.findById
    )

    .put(

        setSection('catalogue/items'),

        upload.fields([
            {
                name: 'image',
                maxCount: 1
            }
        ]),

        controller.update
    )

    .delete(
        controller.destroy
    );


export default router;