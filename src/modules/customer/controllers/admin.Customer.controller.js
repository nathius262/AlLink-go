import * as service from '../services/admin.Customer.service.js';
import { findAll as users } from '../../user/services/admin.User.service.js'

/**
 * Customer list.
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

    return res.status(200).render('./admins/customer_list', {
      success: true,

      pageTitle: 'Customers',
      layout: 'admin',

      customers: data.customers,

      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Customer list controller error:', error);

    return res.status(500).render('errors/500', {
      error,
    });
  }
};


/**
 * Customer details/edit page.
 */
export const findById = async (req, res) => {
  try {
    const customer = await service.findById(
      req.params.id
    );

    const user_list = await users({limit:50, offset:0});

    return res.status(200).render('./admins/customer_update', {
      success: true,

      users:user_list.data,
      pageTitle: 'Update Customer',
      layout: 'admin',

      customer,
    });
  } catch (error) {
    console.error('Customer details controller error:', error);

    if (error.status === 404) {
      return res.status(404).render('errors/404', {
        error,
      });
    }

    return res.status(500).render('errors/500', {
      error,
    });
  }
};


/**
 * Render create customer page.
 */
export const renderCreate = async (req, res) => {
  try {

    const user_list = await users({limit:50, offset:0});

    return res.status(200).render('./admins/customer_create', {
      success: true,

      users: user_list.data,
      pageTitle: 'Create Customer',
      layout: 'admin',
    });
  } catch (error) {
    console.error('Customer create page controller error:', error);

    return res.status(500).render('errors/500', {
      error,
    });
  }
};


/**
 * Create customer.
 */
export const create = async (req, res) => {
  try {
    const customer = await service.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Customer created successfully.',
      data: customer,
      redirectTo: '/admin/customer',
    });
  } catch (error) {
    console.error('Customer create controller error:', error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Unable to create customer.',
      errors: error.errors || null,
    });
  }
};


/**
 * Update customer.
 */
export const update = async (req, res) => {
  try {
    const customer = await service.update(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'Customer updated successfully.',
      data: customer,
      redirectTo: `/admin/customer/${req.params.id}`,
    });
  } catch (error) {
    console.error('Customer update controller error:', error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Unable to update customer.',
      errors: error.errors || null,
    });
  }
};


/**
 * Delete customer.
 */
export const destroy = async (req, res) => {
  try {
    const result = await service.destroy(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: 'Customer deleted successfully.',
      data: result,
      redirectTo: '/admin/customer',
    });
  } catch (error) {
    console.error('Customer delete controller error:', error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Unable to delete customer.',
    });
  }
};