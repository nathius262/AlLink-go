import db from '../../../models/index.cjs';

const { Customer, User, sequelize } = db;

/**
 * Normalize customer payload.
 */
const normalizeCustomerData = (data = {}) => {
  const payload = {
    name: data.name?.trim(),
    email: data.email?.trim().toLowerCase(),
    phone: data.phone?.trim(),
    company: data.company?.trim() || null,
    address: data.address?.trim() || null,
    metadata: data.metadata ?? null,
  };

  // Only include user_id when explicitly provided.
  if (Object.prototype.hasOwnProperty.call(data, 'user_id')) {
    payload.user_id = data.user_id || null;
  }

  return payload;
};

/**
 * Validate customer data.
 */
const validateCustomerData = (data) => {
  const errors = {};

  if (!data.name) {
    errors.name = 'Customer name is required.';
  }

  if (!data.email) {
    errors.email = 'Customer email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!data.phone) {
    errors.phone = 'Customer phone number is required.';
  }

  return errors;
};


/**
 * Fetch paginated customers.
 */
export const findAll = async ({ limit, offset }) => {
  try {
    const {
      rows: customers,
      count: totalItems,
    } = await Customer.findAndCountAll({
      limit,
      offset,
      distinct: true,

      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
          required: false,
        },
      ],

      order: [
        ['created_at', 'DESC'],
        ['updated_at', 'DESC'],
      ],
    });

    return {
      customers,
      totalItems,
      totalPages: limit
        ? Math.ceil(totalItems / limit)
        : 1,
    };
  } catch (error) {
    console.error('Customer findAll error:', error);

    throw new Error(
      `Error fetching customers: ${error.message}`
    );
  }
};


/**
 * Find customer by ID.
 */
export const findById = async (id) => {
  try {
    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
          required: false,
        },
      ],
    });

    if (!customer) {
      throw new Error('Customer not found.');
    }

    return customer;
  } catch (error) {
    console.error('Customer findById error:', error);

    throw new Error(
      `Error fetching customer: ${error.message}`
    );
  }
};


/**
 * Create customer.
 *
 * Supports:
 * - Guest customer
 * - Authenticated customer linked to a User
 */
export const create = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const payload = normalizeCustomerData(data);

    const validationErrors = validateCustomerData(payload);

    if (Object.keys(validationErrors).length > 0) {
      const error = new Error('Validation failed.');
      error.status = 422;
      error.errors = validationErrors;

      throw error;
    }

    /*
     * If a user_id was provided, make sure
     * the user actually exists.
     */
    if (payload.user_id) {
      const user = await User.findByPk(payload.user_id, {
        transaction,
      });

      if (!user) {
        const error = new Error('The specified user does not exist.');
        error.status = 422;

        throw error;
      }
    }

    /*
     * We intentionally do NOT enforce email uniqueness
     * at the database level.
     *
     * This allows the system to handle guest interactions
     * without making customer identity unnecessarily rigid.
     */
    const customer = await Customer.create(payload, {
      transaction,
    });

    await transaction.commit();

    return await Customer.findByPk(customer.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
          required: false,
        },
      ],
    });
  } catch (error) {
    await transaction.rollback();

    console.error('Customer create error:', error);

    throw error;
  }
};


/**
 * Update customer.
 */
export const update = async (id, data) => {
  const transaction = await sequelize.transaction();

  try {
    const customer = await Customer.findByPk(id, {
      transaction,
    });

    if (!customer) {
      const error = new Error('Customer not found.');
      error.status = 404;

      throw error;
    }

    const payload = normalizeCustomerData(data);

    /*
     * Don't allow an update request to accidentally
     * remove/change the customer-user relationship
     * unless user_id was explicitly supplied.
     */
    if (
      !Object.prototype.hasOwnProperty.call(data, 'user_id')
    ) {
      delete payload.user_id;
    }

    const validationErrors = validateCustomerData({
      name: payload.name ?? customer.name,
      email: payload.email ?? customer.email,
      phone: payload.phone ?? customer.phone,
    });

    if (Object.keys(validationErrors).length > 0) {
      const error = new Error('Validation failed.');
      error.status = 422;
      error.errors = validationErrors;

      throw error;
    }

    /*
     * If user_id is being changed, verify the new user.
     */
    if (payload.user_id) {
      const user = await User.findByPk(payload.user_id, {
        transaction,
      });

      if (!user) {
        const error = new Error('The specified user does not exist.');
        error.status = 422;

        throw error;
      }
    }

    await customer.update(payload, {
      transaction,
    });

    await transaction.commit();

    return await Customer.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
          required: false,
        },
      ],
    });
  } catch (error) {
    await transaction.rollback();

    console.error('Customer update error:', error);

    throw error;
  }
};


/**
 * Delete customer.
 */
export const destroy = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const customer = await Customer.findByPk(id, {
      transaction,
    });

    if (!customer) {
      const error = new Error('Customer not found.');
      error.status = 404;

      throw error;
    }

    await customer.destroy({
      transaction,
    });

    await transaction.commit();

    return {
      id,
      deleted: true,
    };
  } catch (error) {
    await transaction.rollback();

    console.error('Customer delete error:', error);

    throw error;
  }
};