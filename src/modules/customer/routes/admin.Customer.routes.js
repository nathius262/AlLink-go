import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import {withPagination} from '../../../middlewares/paginations.js';
import * as controller from '../controllers/admin.Customer.controller.js';

const router = express.Router();

router.use(useModuleViews('customer'));

// Admin view routes
router.route('/')
  .get(withPagination(10), controller.findAll)
  .post(controller.create);


// Admin view routes
router.route('/create')
  .get(controller.renderCreate)
  .post(controller.create);

router.route('/:id')
  .get(controller.findById)
  .put(controller.update)
  .delete(controller.destroy);

export default router;
