import * as service from '../services/admin.services.js';
import * as contactService from '../modules/contact/services/admin.Contact.service.js'


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

export const create_contact = async (req, res) => {
  try {
    const data = await contactService.create(req.body);
    res.status(201).json({ success: true, redirectTo: "/contact", message: "Your message has been sent successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};
