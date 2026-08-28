import * as service from '../services/Portfolio.service.js';

export const findAll = async (req, res) => {
  const {page, limit, offset} = req.pagination
  try {
    const data = await service.findAll({limit, offset});
    res.status(200).render('./portfolio_list', {
      success: true,
      pageTitle: "Portfolio",
      portfolios: data.portfolios,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page
    });
  } catch (err) {
  console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};

export const findBySlug = async (req, res) => {
  try {
    const data = await service.findBySlug(req.params.slug);
    res.status(200).render('./portfolio_single', {
      success: true,
      pageTitle: data.title,
      portfolio: data,
    });
  } catch (err) {
  console.log(err)
    res.status(404).render('errors/404', { error: err });
  }
};