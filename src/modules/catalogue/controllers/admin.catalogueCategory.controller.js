import * as service from '../services/admin.catalogueCategory.service.js';


/**
 * List categories.
 */
export const findAll = async (req, res) => {
  const {
    page,
    limit,
    offset,
  } = req.pagination;

  try {
    const data = await service.findAll({
      limit,
      offset,
    });

    return res.status(200).render(
      './admins/category/category_list',
      {
        success: true,

        pageTitle: 'Catalogue Categories',
        PageTitle: 'Catalogue',
        layout: 'admin',

        categories: data.categories,

        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: page,
      }
    );
  } catch (error) {
    console.error(
      'Catalogue category list controller error:',
      error
    );

    return res.status(500).render('errors/500', {
      error,
    });
  }
};


/**
 * Render create page.
 */
export const renderCreate = async (req, res) => {
  try {
    return res.status(200).render(
      './admins/category/category_create',
      {
        success: true,

        pageTitle: 'Create Catalogue Category',
        PageTitle: 'Catalogue',
        layout: 'admin',
      }
    );
  } catch (error) {
    console.error(
      'Catalogue category create page error:',
      error
    );

    return res.status(500).render('errors/500', {
      error,
    });
  }
};


/**
 * Render update page.
 */
export const findById = async (req, res) => {
  try {
    const category = await service.findById(
      req.params.id
    );

    return res.status(200).render(
      './admins/category/category_update',
      {
        success: true,

        pageTitle: 'Update Catalogue Category',
        PageTitle: 'Catalogue',
        layout: 'admin',

        category,
      }
    );
  } catch (error) {
    console.error(
      'Catalogue category details controller error:',
      error
    );

    return res.status(error.status || 500).render(
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
 * Create category.
 */
export const create = async (req, res) => {
  try {
    const image = req.files?.image?.[0]?.path || null;

    console.log(req.body)

    const category = await service.create(
      req.body,
      image
    );

    return res.status(201).json({
      success: true,
      message: 'Catalogue category created successfully.',
      data: category,
      redirectTo: '/admin/catalogue/category',
    });
  } catch (error) {
    console.error(
      'Catalogue category create controller error:',
      error
    );

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        'Unable to create catalogue category.',
      errors: error.errors || null,
    });
  }
};


/**
 * Update category.
 */
export const update = async (req, res) => {
  try {
    const image = req.files?.image?.[0]?.path || null;

    const category = await service.update(
      req.params.id,
      req.body,
      image
    );

    return res.status(200).json({
      success: true,
      message: 'Catalogue category updated successfully.',
      data: category,
      redirectTo:
        `/admin/catalogue/category/${req.params.id}`,
    });
  } catch (error) {
    console.error(
      'Catalogue category update controller error:',
      error
    );

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        'Unable to update catalogue category.',
      errors: error.errors || null,
    });
  }
};


/**
 * Delete category.
 */
export const destroy = async (req, res) => {
  try {
    const result = await service.destroy(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: 'Catalogue category deleted successfully.',
      data: result,
      redirectTo: '/admin/catalogue/category',
    });
  } catch (error) {
    console.error(
      'Catalogue category delete controller error:',
      error
    );

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message ||
        'Unable to delete catalogue category.',
    });
  }
};