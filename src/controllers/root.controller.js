import { check, validationResult } from 'express-validator';
import dotenv from 'dotenv';

// Derive the equivalent of __dirname
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();


const page_logo = process.env.PAGELOGO

export const index_view = async (req, res) => {
    try {

        res.render('index', {
            pageTitle: "Home",
            pageLogo: page_logo
        });
    } catch (err) {

        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

export const about_view = async (req, res) => {
    try {

        res.render('about', {
            pageTitle: "About",
            pageLogo: page_logo
        });
    } catch (err) {

        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

export const portfolio_view = async (req, res) => {
    try {

        res.render('portfolio', {
            pageTitle: "Portfolio",
            pageLogo: page_logo
        });
    } catch (err) {
        
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

export const contact_view = async (req, res) => {
    try {

        res.render('contact', {
            pageTitle: "Contact",
            pageLogo: page_logo
        });
    } catch (err) {
        
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
    }
};

//SERVICE SECTION
export const service_view = async (req, res) => {
    try {

        res.render('serviceS', {
            pageTitle: "Service Cataloge",
            pageLogo: page_logo
        });
    } catch (err) {
        
        res.status(500).render('./errors/500', { message: 'Internal Server Error', error: err.message });
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