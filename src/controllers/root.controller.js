import dotenv from 'dotenv';

import * as catalogueCategoryService
    from '../modules/catalogue/services/admin.catalogueCategory.service.js';

import * as portfolioService
    from '../modules/portfolio/services/admin.Portfolio.service.js';

import * as testimonyService
    from '../modules/testimony/services/admin.Testimony.service.js';

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
 * SERVICE DETAIL
 *
 * Example:
 * /services/brand-identity
 */
export const service_detail_view = async (req, res) => {
    try {

        const { slug } = req.params;

        const category =
            await catalogueCategoryService.findBySlug(slug);

        return res.render(
            './services/service-detail',
            {

                pageTitle: category.name,
                pageLogo: page_logo,

                category

            }
        );

    } catch (err) {

        console.error(
            'Public service detail controller error:',
            err
        );

        return res.status(err.status || 500).render(
            err.status === 404
                ? 'errors/404'
                : 'errors/500',
            {
                message: err.message,
                error: err
            }
        );

    }
};

//SERVICE CATALOG
export const brand_consultation_view = async (req, res) => {
    try {

        res.render('./services/brand-consultant', {
            pageTitle: "Brand Consultation",
            pageLogo: page_logo
        });
    } catch (err) {

        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

export const brand_identity_view = async (req, res) => {
    try {

        res.render('./services/brand-identity', {
            pageTitle: "Brand Identity",
            pageLogo: page_logo
        });
    } catch (err) {

        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

export const digital_offset_print_view = async (req, res) => {
    try {

        res.render('./services/offset-printing', {
            pageTitle: "Digital & Offset Printing",
            pageLogo: page_logo
        });
    } catch (err) {

        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

export const packaging_design_view = async (req, res) => {
    try {

        res.render('./services/packaging-design', {
            pageTitle: "Packaging Design",
            pageLogo: page_logo
        });
    } catch (err) {

        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

export const ready_made_view = async (req, res) => {
    try {

        res.render('./services/ready-made-package', {
            pageTitle: "Ready-made Package",
            pageLogo: page_logo
        });
    } catch (err) {

        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};