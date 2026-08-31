import dotenv from 'dotenv';

import * as catalogueCategoryService
    from '../modules/catalogue/services/admin.catalogueCategory.service.js';

import * as catalogueItemService
    from '../modules/catalogue/services/admin.catalogueItem.service.js';

import * as portfolioService
    from '../modules/portfolio/services/admin.Portfolio.service.js';

import * as testimonyService
    from '../modules/testimony/services/admin.Testimony.service.js';

// Derive the equivalent of __dirname
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const page_logo = process.env.PAGELOGO;


/**
 * HOME
 */
export const index_view = async (req, res) => {
    try {

        const [
            catalogueData,
            portfolioData,
            testimonyData
        ] = await Promise.all([

            catalogueCategoryService.findAll({
                limit: 6,
                offset: 0
            }),

            portfolioService.findAll({
                limit: 6,
                offset: 0
            }),

            testimonyService.findAll({
                limit: 6,
                offset: 0
            })

        ]);

        return res.render('index', {

            pageTitle: 'Home',
            pageLogo: page_logo,

            categories: catalogueData.categories,

            portfolios: portfolioData.portfolios,

            testimonies: testimonyData.testimonies

        });

    } catch (err) {

        console.error('Public home controller error:', err);

        return res.status(500).render('./errors/500', {
            message: 'Internal Server Error',
            error: err.message
        });

    }
};


/**
 * ABOUT
 */
export const about_view = async (req, res) => {
    try {

        return res.render('about', {

            pageTitle: 'About',
            pageLogo: page_logo

        });

    } catch (err) {

        console.error('Public about controller error:', err);

        return res.status(500).render('./errors/500', {
            message: 'Internal Server Error',
            error: err.message
        });

    }
};


/**
 * PORTFOLIO
 */
export const portfolio_view = async (req, res) => {
    try {

        const {
            portfolios,
            totalItems,
            totalPages
        } = await portfolioService.findAll({
            limit: 20,
            offset: 0
        });

        return res.render('portfolio', {

            pageTitle: 'Portfolio',
            pageLogo: page_logo,

            portfolios,
            totalItems,
            totalPages

        });

    } catch (err) {

        console.error('Public portfolio controller error:', err);

        return res.status(500).render('./errors/500', {
            message: 'Internal Server Error',
            error: err.message
        });

    }
};


/**
 * CONTACT
 */
export const contact_view = async (req, res) => {
    try {

        return res.render('contact', {

            pageTitle: 'Contact',
            pageLogo: page_logo

        });

    } catch (err) {

        console.error('Public contact controller error:', err);

        return res.status(500).render('./errors/500', {
            message: 'Internal Server Error',
            error: err.message
        });

    }
};


/**
 * SERVICES
 */
export const service_view = async (req, res) => {
    try {

        const {
            categories,
            totalItems,
            totalPages
        } = await catalogueCategoryService.findAll({
            limit: 50,
            offset: 0
        });

        return res.render('serviceS', {

            pageTitle: 'Service Catalogue',
            pageLogo: page_logo,

            categories,
            totalItems,
            totalPages

        });

    } catch (err) {

        console.error('Public services controller error:', err);

        return res.status(500).render('./errors/500', {
            message: 'Internal Server Error',
            error: err.message
        });

    }
};


/**
 * Brand Consultation
 */
export const brand_consultation_view = async (req, res) => {
    try {

        const category = await catalogueCategoryService.findBySlug(
            'brand-consultation'
        );

        const catalogueItems = await catalogueItemService.findAllByCategory({
            category_id: category.id,
            limit: 10,
            offset: 0
        });

        return res.render('./services/brand-consultant', {
            pageTitle: category.name,
            pageLogo: page_logo,
            category,
            items: catalogueItems.items
        });

    } catch (err) {

        console.error('Brand consultation page error:', err);

        return res.status(err.status || 500).render('./errors/500', {
            message: err.message || 'Internal Server Error',
            error: err
        });
    }
};


/**
 * Brand Identity
 */
export const brand_identity_view = async (req, res) => {
    try {

        const category = await catalogueCategoryService.findBySlug(
            'brand-and-brand-identity'
        );

        const catalogueItems = await catalogueItemService.findAllByCategory({
            category_id: category.id,
            limit: 10,
            offset: 0
        });

        return res.render('./services/brand-identity', {
            pageTitle: category.name,
            pageLogo: page_logo,
            category,
            items: catalogueItems.items
        });

    } catch (err) {

        console.error('Brand identity page error:', err);

        return res.status(err.status || 500).render('./errors/500', {
            message: err.message || 'Internal Server Error',
            error: err
        });
    }
};


/**
 * Digital & Offset Printing
 */
export const digital_offset_print_view = async (req, res) => {
    try {

        const category = await catalogueCategoryService.findBySlug(
            'digital-printing-and-offset-printing'
        );

        const catalogueItems = await catalogueItemService.findAllByCategory({
            category_id: category.id,
            limit: 10,
            offset: 0
        });

        return res.render('./services/offset-printing', {
            pageTitle: category.name,
            pageLogo: page_logo,
            category,
            items: catalogueItems.items
        });

    } catch (err) {

        console.error('Digital & offset printing page error:', err);

        return res.status(err.status || 500).render('./errors/500', {
            message: err.message || 'Internal Server Error',
            error: err
        });
    }
};


/**
 * Packaging Design
 */
export const packaging_design_view = async (req, res) => {
    try {

        const category = await catalogueCategoryService.findBySlug(
            'product-design-and-packaging'
        );

        const catalogueItems = await catalogueItemService.findAllByCategory({
            category_id: category.id,
            limit: 10,
            offset: 0
        });

        return res.render('./services/packaging-design', {
            pageTitle: category.name,
            pageLogo: page_logo,
            category,
            items:catalogueItems.items
        });

    } catch (err) {

        console.error('Packaging design page error:', err);

        return res.status(err.status || 500).render('./errors/500', {
            message: err.message || 'Internal Server Error',
            error: err
        });
    }
};


/**
 * Ready-made Packaging
 */
export const ready_made_view = async (req, res) => {

    try {

        const category = await catalogueCategoryService.findBySlug(
            "ready-made-packaging"
        );

        if (!category) {
            return res.status(404).render("./errors/404", {
                message: "Service not found"
            });
        }


        const catalogueItems = await catalogueItemService.findAllByCategory({
            category_id: category.id,
            limit: 10,
            offset: 0
        });

        res.render("./services/ready-made-package", {

            pageTitle: category.name,

            pageLogo: page_logo,

            category,

            items: catalogueItems.items
        });

    } catch (err) {

        console.error(
            "Error loading ready-made packaging:",
            err
        );

        res.status(500).render("./errors/500", {

            message: "Internal Server Error",

            error: err.message

        });

    }

};

/**
 * Brand Consultation
 */
export const service_detail_view = async (req, res) => {
    try {

        const { slug } = req.params;

        const category = await catalogueCategoryService.findBySlug(
            slug
        );

        const catalogueItems = await catalogueItemService.findAllByCategory({
            category_id: category.id,
            limit: 10,
            offset: 0
        });

        return res.render('./services/service-detail', {
            pageTitle: category.name,
            pageLogo: page_logo,
            category,
            items: catalogueItems.items
        });

    } catch (err) {

        console.error('Brand consultation page error:', err);

        return res.status(err.status || 500).render('./errors/500', {
            message: err.message || 'Internal Server Error',
            error: err
        });
    }
};


export const sitemap_view = async (req, res) => {

    try {
        res.sendFile(path.join(__dirname, '..', 'views', 'sitemap.xml'));
    } catch (error) {
        res.status(404).send('Not found');
    }
};