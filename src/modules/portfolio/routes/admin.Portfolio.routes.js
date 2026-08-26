import express from 'express';

import * as controller
  from '../controllers/admin.Portfolio.controller.js';

import upload
  from '../../../config/multerConfig.js';

import setSection
  from '../../../middlewares/uploadLocation.js';

import {
  withPagination
} from '../../../middlewares/paginations.js';
import useModuleViews from '../../../middlewares/moduleViews.js';


const router =
  express.Router();


router.use(useModuleViews('portfolio'));

// ==========================================
// ADMIN VIEW ROUTES
// ==========================================

router.get(
  '/',
  withPagination(20),
  controller.findAll
);


router.get(
  '/create',
  controller.renderCreate
);


router.get(
  '/:id',
  controller.findById
);


// ==========================================
// ADMIN MUTATION ROUTES
// ==========================================

router.post(
  '/create',

  setSection('portfolio'),

  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),

  controller.create
);


router.put(
  '/:id',

  setSection('portfolio'),

  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),

  controller.update
);


router.delete(
  '/:id',

  controller.destroy
);


export default router;