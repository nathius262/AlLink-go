import * as service
  from '../services/admin.Portfolio.service.js';


/**
 * List portfolio items.
 */
export const findAll = async (req, res) => {

  const {
    page,
    limit,
    offset,
  } = req.pagination;

  try {

    const data =
      await service.findAll({
        limit,
        offset,
      });

    return res.status(200).render(
      './admins/portfolio_list',
      {
        success: true,

        pageTitle:
          'Portfolio',

        PageTitle:
          'Portfolio',

        layout:
          'admin',

        portfolios:
          data.portfolios,

        totalItems:
          data.totalItems,

        totalPages:
          data.totalPages,

        currentPage:
          page,
      }
    );

  } catch (error) {

    console.error(
      'Portfolio list controller error:',
      error
    );

    return res.status(500).render(
      'errors/500',
      {
        error,
      }
    );
  }
};


/**
 * Render create page.
 */
export const renderCreate = async (
  req,
  res
) => {

  try {

    return res.status(200).render(
      './admins/portfolio_create',
      {
        success: true,

        pageTitle:
          'Create Portfolio',

        PageTitle:
          'Portfolio',

        layout:
          'admin',
      }
    );

  } catch (error) {

    console.error(
      'Portfolio create page error:',
      error
    );

    return res.status(500).render(
      'errors/500',
      {
        error,
      }
    );
  }
};


/**
 * Render update page.
 */
export const findById = async (
  req,
  res
) => {

  try {

    const portfolio =
      await service.findById(
        req.params.id
      );

    return res.status(200).render(
      './admins/portfolio_update',
      {
        success: true,

        pageTitle:
          'Update Portfolio',

        PageTitle:
          'Portfolio',

        layout:
          'admin',

        portfolio,
      }
    );

  } catch (error) {

    console.error(
      'Portfolio details controller error:',
      error
    );

    return res.status(
      error.status || 500
    ).render(
      error.status === 404
        ? 'errors/404'
        : 'errors/500',
      {
        error,
      }
    );
  }
};


/**
 * Create portfolio item.
 */
export const create = async (
  req,
  res
) => {

  try {

    const image =
      req.files?.image?.[0]?.path ||
      null;


    const portfolio =
      await service.create(
        req.body,
        image
      );


    return res.status(201).json({

      success: true,

      message:
        'Portfolio item created successfully.',

      data:
        portfolio,

      redirectTo:
        '/admin/portfolio',

    });

  } catch (error) {

    console.error(
      'Portfolio create controller error:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      success: false,

      message:
        error.message ||
        'Unable to create portfolio item.',

      errors:
        error.errors || null,

    });
  }
};


/**
 * Update portfolio item.
 */
export const update = async (
  req,
  res
) => {

  try {

    const image =
      req.files?.image?.[0]?.path ||
      null;


    const portfolio =
      await service.update(
        req.params.id,
        req.body,
        image
      );


    return res.status(200).json({

      success: true,

      message:
        'Portfolio item updated successfully.',

      data:
        portfolio,

      redirectTo:
        `/admin/portfolio/${req.params.id}`,

    });

  } catch (error) {

    console.error(
      'Portfolio update controller error:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      success: false,

      message:
        error.message ||
        'Unable to update portfolio item.',

      errors:
        error.errors || null,

    });
  }
};


/**
 * Delete portfolio item.
 */
export const destroy = async (
  req,
  res
) => {

  try {

    const result =
      await service.destroy(
        req.params.id
      );


    return res.status(200).json({

      success: true,

      message:
        'Portfolio item deleted successfully.',

      data:
        result,

      redirectTo:
        '/admin/portfolio',

    });

  } catch (error) {

    console.error(
      'Portfolio delete controller error:',
      error
    );

    return res.status(
      error.status || 500
    ).json({

      success: false,

      message:
        error.message ||
        'Unable to delete portfolio item.',

    });
  }
};