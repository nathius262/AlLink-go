import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import {withPagination} from '../../../middlewares/paginations.js';
import catalogueCategory from './admin.catalogueCategory.route.js';
import catalogueItem from './admin.catalogueItem.routes.js';
const router = express.Router();

router.use(useModuleViews('catalogue'));

router.use('/category', catalogueCategory);
router.use('/item', catalogueItem);

export default router;
