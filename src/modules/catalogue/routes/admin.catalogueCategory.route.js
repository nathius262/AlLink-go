import express from 'express';

import * as controller from '../controllers/admin.catalogueCategory.controller.js';

import upload from '../../../config/multerConfig.js';
import setSection from '../../../middlewares/uploadLocation.js';

import {withPagination} from '../../../middlewares/paginations.js';

const router = express.Router();


// Admin view routes
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


// Admin mutation routes
router.post(
  '/create',
  setSection('catalogue'),
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
  setSection('catalogue'),
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