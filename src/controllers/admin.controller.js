import * as service from '../services/admin.services.js';


/**
 * Render admin dashboard.
 */
export const dashboard_view = async (req, res) => {
    try {

        const dashboard =
            await service.getDashboardOverview();

        return res.status(200).render(
            './admins/dashboard',
            {
                success: true,

                pageTitle: 'Dashboard',

                PageTitle: 'Dashboard',

                layout: 'admin',
                currentDate: Date.now(),

                stats: dashboard.statistics,

                recentCustomers:
                    dashboard.recentCustomers,

                recentPortfolios:
                    dashboard.recentPortfolios,

                recentTestimonials:
                    dashboard.recentTestimonials,
            }
        );

    } catch (error) {

        console.error(
            'Admin dashboard controller error:',
            error
        );

        return res.status(
            error.status || 500
        ).render('errors/500', {
            error,
        });
    }
};
