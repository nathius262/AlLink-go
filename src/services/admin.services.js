import db from '../models/index.cjs';

const {
    Customer,
    CatalogueCategory,
    CatalogueItem,
    Portfolio,
    Testimony,
    User,
    Role,
} = db;


/**
 * Get dashboard statistics.
 */
export const getStatistics = async () => {
    try {
        const [
            totalCustomers,

            totalCategories,
            activeCategories,

            totalCatalogueItems,
            activeCatalogueItems,

            totalPortfolios,
            activePortfolios,

            totalTestimonials,
            publishedTestimonials,

            totalUsers,

            totalRoles,
        ] = await Promise.all([
            // Customers
            Customer.count(),

            // Catalogue Categories
            CatalogueCategory.count(),
            CatalogueCategory.count({
                where: {
                    is_active: true,
                },
            }),

            // Catalogue Items
            CatalogueItem.count(),
            CatalogueItem.count({
                where: {
                    is_active: true,
                },
            }),

            // Portfolio
            Portfolio.count(),
            Portfolio.count({
                where: {
                    is_active: true,
                },
            }),

            // Testimonials
            Testimony.count(),
            Testimony.count({
                where: {
                    is_active: true,
                },
            }),

            // Users
            User.count(),

            // Roles
            Role.count(),
        ]);

        return {
            customers: {
                total: totalCustomers,
            },

            categories: {
                total: totalCategories,
                active: activeCategories,
                inactive: totalCategories - activeCategories,
            },

            catalogueItems: {
                total: totalCatalogueItems,
                active: activeCatalogueItems,
                inactive: totalCatalogueItems - activeCatalogueItems,
            },

            portfolios: {
                total: totalPortfolios,
                active: activePortfolios,
                inactive: totalPortfolios - activePortfolios,
            },

            testimonials: {
                total: totalTestimonials,
                active: publishedTestimonials,
                inactive: totalTestimonials - publishedTestimonials,
            },

            users: {
                total: totalUsers,
            },

            roles: {
                total: totalRoles,
            },
        };

    } catch (error) {
        console.error('Dashboard statistics error:', error);

        throw new Error(
            `Error fetching dashboard statistics: ${error.message}`
        );
    }
};


/**
 * Get recent dashboard activity.
 */
export const getRecentActivity = async () => {
    try {
        const [
            recentCustomers,
            recentPortfolios,
            recentTestimonials,
        ] = await Promise.all([

            Customer.findAll({
                attributes: [
                    'id',
                    'name',
                    'email',
                    'createdAt',
                ],
                order: [
                    ['createdAt', 'DESC'],
                ],
                limit: 5,
            }),

            Portfolio.findAll({
                attributes: [
                    'id',
                    'title',
                    'image',
                    'createdAt',
                ],
                order: [
                    ['createdAt', 'DESC'],
                ],
                limit: 5,
            }),

            Testimony.findAll({
                attributes: [
                    'id',
                    'name',
                    'rating',
                    'is_active',
                    'createdAt',
                ],
                order: [
                    ['createdAt', 'DESC'],
                ],
                limit: 5,
            }),

        ]);

        return {
            recentCustomers,
            recentPortfolios,
            recentTestimonials,
        };

    } catch (error) {
        console.error('Dashboard recent activity error:', error);

        throw new Error(
            `Error fetching recent dashboard activity: ${error.message}`
        );
    }
};


/**
 * Get complete dashboard overview.
 */
export const getDashboardOverview = async () => {
    try {
        const [
            statistics,
            recentActivity,
        ] = await Promise.all([
            getStatistics(),
            getRecentActivity(),
        ]);

        return {
            statistics,
            ...recentActivity,
        };

    } catch (error) {
        console.error('Dashboard overview error:', error);

        throw new Error(
            `Error fetching dashboard overview: ${error.message}`
        );
    }
};