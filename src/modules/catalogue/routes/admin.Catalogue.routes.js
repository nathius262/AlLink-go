import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import {withPagination} from '../../../middlewares/paginations.js';
import catalogueCategory from './admin.catalogueCategory.route.js'
const router = express.Router();

router.use(useModuleViews('catalogue'));

router.use('/category', catalogueCategory);

export default router;
