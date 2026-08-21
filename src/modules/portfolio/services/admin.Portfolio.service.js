import db from '../../../models/index.cjs';

import { getPublicIdFromUrl } from '../../../utils/utils.js';

import cloudinary from '../../../config/cloudinaryConfig.js';

const { Portfolio } = db;

/**
 * Generate a unique fallback slug.
 *
 * The frontend normally generates the slug.
 * This only protects against duplicate submissions.
 */
const ensureUniqueSlug = async (slug, excludeId = null) => {
  let uniqueSlug = slug;

  const where = {
    slug: uniqueSlug,
  };

  if (excludeId) {
    where.id = {
      [db.Sequelize.Op.ne]: excludeId,
    };
  }

  let exists = await Portfolio.findOne({ where });

  if (exists) {
    uniqueSlug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Extremely unlikely, but make sure it is actually unique.
    while (
      await Portfolio.findOne({
        where: {
          slug: uniqueSlug,
          ...(excludeId
            ? {
              id: {
                [db.Sequelize.Op.ne]: excludeId,
              },
            }
            : {}),
        },
      })
    ) {
      uniqueSlug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  return uniqueSlug;
};


/**
 * Find all portfolio records.
 */
export const findAll = async ({ limit, offset }) => {
  try {
    const {
      rows: portfolios,
      count: totalItems,
    } = await Portfolio.findAndCountAll({
      limit,
      offset,
      order: [
        ['sort_order', 'ASC'],
        ['created_at', 'DESC'],
      ],
    });

    return {
      portfolios,
      totalItems,
      totalPages: limit
        ? Math.ceil(totalItems / limit)
        : 1,
    };
  } catch (error) {
    console.error(
      'Portfolio findAll error:',
      error
    );

    throw new Error(
      `Error fetching portfolios: ${error.message}`
    );
  }
};


/**
 * Find portfolio by ID.
 */
export const findById = async (id) => {
  try {
    const portfolio = await Portfolio.findByPk(id);

    if (!portfolio) {
      const error = new Error(
        'Portfolio item not found.'
      );

      error.status = 404;

      throw error;
    }

    return portfolio;
  } catch (error) {
    console.error(
      'Portfolio findById error:',
      error
    );

    throw error;
  }
};


/**
 * Create portfolio item.
 */
export const create = async (data, image = null) => {
  try {

    if (!data.title?.trim()) {
      const error = new Error(
        'Portfolio title is required.'
      );

      error.status = 422;

      throw error;
    }

    if (!data.slug?.trim()) {
      const error = new Error(
        'Portfolio slug is required.'
      );

      error.status = 422;

      throw error;
    }

    const slug = await ensureUniqueSlug(
      data.slug.trim().toLowerCase()
    );

    const portfolio = await Portfolio.create({

      title: data.title.trim(),

      slug,

      description:
        data.description?.trim() || null,

      client_name:
        data.client?.trim() || null,

      category:
        data.category?.trim() || null,

      image:
        image || null,

      is_active:
        data.is_active === undefined
          ? true
          : data.is_active === 'true' ||
          data.is_active === true ||
          data.is_active == 1,

      sort_order:
        Number(data.sort_order) || 0,
    });

    return portfolio;

  } catch (error) {

    console.error(
      'Portfolio create error:',
      error
    );

    throw error;
  }
};


/**
 * Update portfolio item.
 */
export const update = async (
  id,
  data,
  image = null
) => {
  try {

    const portfolio =
      await Portfolio.findByPk(id);

    if (!portfolio) {
      const error = new Error(
        'Portfolio item not found.'
      );

      error.status = 404;

      throw error;
    }


    let slug = portfolio.slug;

    if (
      data.slug &&
      data.slug !== portfolio.slug
    ) {
      slug = await ensureUniqueSlug(
        data.slug.trim().toLowerCase(),
        id
      );
    }


    const updateData = {

      title:
        data.title?.trim(),

      slug,

      description:
        data.description?.trim() || null,

      client_name:
        data.client?.trim() || null,

      category:
        data.category?.trim() || null,

      is_active:
        data.is_active === undefined
          ? portfolio.is_active
          : data.is_active === 'true' ||
          data.is_active === true ||
          data.is_active == 1,

      sort_order:
        data.sort_order !== undefined
          ? Number(data.sort_order) || 0
          : portfolio.sort_order,
    };


    /**
     * Only replace image when
     * a new image was uploaded.
     */
    if (image) {

      /**
       * Delete previous Cloudinary image.
       */
      if (portfolio.image) {

        try {

          const publicId =
            getPublicIdFromUrl(
              portfolio.image
            );

          if (publicId) {
            await cloudinary.uploader.destroy(
              publicId
            );
          }

        } catch (cloudinaryError) {

          console.error(
            'Cloudinary portfolio image replacement error:',
            cloudinaryError
          );

        }
      }

      updateData.image = image;
    }


    await portfolio.update(
      updateData
    );

    return portfolio;

  } catch (error) {

    console.error(
      'Portfolio update error:',
      error
    );

    throw error;
  }
};


/**
 * Delete portfolio item.
 */
export const destroy = async (id) => {
  try {

    const portfolio =
      await Portfolio.findByPk(id);

    if (!portfolio) {

      const error = new Error(
        'Portfolio item not found.'
      );

      error.status = 404;

      throw error;
    }


    /**
     * Delete image from Cloudinary first.
     */
    if (portfolio.image) {

      try {

        const publicId =
          getPublicIdFromUrl(
            portfolio.image
          );

        if (publicId) {
          await cloudinary.uploader.destroy(
            publicId
          );
        }

      } catch (cloudinaryError) {

        console.error(
          'Cloudinary portfolio image deletion error:',
          cloudinaryError
        );

      }
    }


    await portfolio.destroy();

    return {
      id,
      deleted: true,
    };

  } catch (error) {

    console.error(
      'Portfolio delete error:',
      error
    );

    throw error;
  }
};