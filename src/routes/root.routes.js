import { Router } from "express";
import { dashboard_view, create_contact } from "../controllers/admin.controller.js";
import * as rootController from "../controllers/root.controller.js";
import {create as createContact} from '../modules/contact/controllers/admin.Contact.controller.js'

const router = Router();

// Home Route
router.get('/', rootController.index_view);
router.get('/about', rootController.about_view);
router.get('/contact', rootController.contact_view);
router.post('/contact', create_contact);
router.get('/portfolio', rootController.portfolio_view);
router.get('/services', rootController.service_view);
router.get('/services/brand-consultation', rootController.brand_consultation_view);
router.get('/services/brand-identity', rootController.brand_identity_view);
router.get('/services/digital-offset-printing', rootController.digital_offset_print_view);
router.get('/services/packaging-design', rootController.packaging_design_view);
router.get('/services/ready-made-packaging', rootController.ready_made_view);
router.get('/services/:slug', rootController.service_detail_view);
router.get('/admin', dashboard_view)


export default router;