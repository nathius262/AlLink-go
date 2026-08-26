import * as service
  from '../services/admin.Testimony.service.js';


/**
 * List testimonies.
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
      './admins/testimony_list',
      {
        success: true,

        pageTitle:
          'Testimonials',

        PageTitle:
          'Testimonials',

        layout:
          'admin',

        testimonies:
          data.testimonies,

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
      'Testimony list controller error:',
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
      './admins/testimony_create',
      {
        success: true,

        pageTitle:
          'Create Testimony',

        PageTitle:
          'Testimonials',

        layout:
          'admin',
      }
    );
  } catch (error) {
    console.error(
      'Testimony create page error:',
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
    const testimony =
      await service.findById(
        req.params.id
      );

    return res.status(200).render(
      './admins/testimony_update',
      {
        success: true,

        pageTitle:
          'Update Testimony',

        PageTitle:
          'Testimonials',

        layout:
          'admin',

        testimony,
      }
    );
  } catch (error) {
    console.error(
      'Testimony details controller error:',
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
 * Create testimony.
 */
export const create = async (
  req,
  res
) => {
  try {
    const image =
      req.files?.image?.[0]?.path ||
      null;

    const testimony =
      await service.create(
        req.body,
        image
      );

    return res.status(201).json({
      success: true,

      message:
        'Testimony created successfully.',

      data:
        testimony,

      redirectTo:
        '/admin/testimony',
    });
  } catch (error) {
    console.error(
      'Testimony create controller error:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message ||
        'Unable to create testimony.',

      errors:
        error.errors || null,
    });
  }
};


/**
 * Update testimony.
 */
export const update = async (
  req,
  res
) => {
  try {
    const image =
      req.files?.image?.[0]?.path ||
      null;

    const testimony =
      await service.update(
        req.params.id,
        req.body,
        image
      );

    return res.status(200).json({
      success: true,

      message:
        'Testimony updated successfully.',

      data:
        testimony,

      redirectTo:
        `/admin/testimony/${req.params.id}`,
    });
  } catch (error) {
    console.error(
      'Testimony update controller error:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message ||
        'Unable to update testimony.',

      errors:
        error.errors || null,
    });
  }
};


/**
 * Delete testimony.
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
        'Testimony deleted successfully.',

      data:
        result,

      redirectTo:
        '/admin/testimony',
    });
  } catch (error) {
    console.error(
      'Testimony delete controller error:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      success: false,

      message:
        error.message ||
        'Unable to delete testimony.',
    });
  }
};