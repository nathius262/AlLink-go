import db from '../../../models/index.cjs';
import { getPublicIdFromUrl } from '../../../utils/utils.js';
import cloudinary from '../../../config/cloudinaryConfig.js';

const { CatalogueCategory } = db;


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

  let exists = await CatalogueCategory.findOne({ where });

  if (exists) {
    uniqueSlug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Extremely unlikely, but make sure it is actually unique.
    while (
      await CatalogueCategory.findOne({
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
 * Find all categories.
 */
export const findAll = async ({ limit, offset }) => {
  try {
    const {
      rows: categories,
      count: totalItems,
    } = await CatalogueCategory.findAndCountAll({
      limit,
      offset,

      order: [
        ['sort_order', 'ASC'],
        ['created_at', 'DESC'],
      ],
    });

    return {
      categories,
      totalItems,
      totalPages: limit
        ? Math.ceil(totalItems / limit)
        : 1,
    };
  } catch (error) {
    console.error('Catalogue category findAll error:', error);

    throw new Error(
      `Error fetching catalogue categories: ${error.message}`
    );
  }
};


/**
 * Find category by ID.
 */
export const findById = async (id) => {
  try {
    const category = await CatalogueCategory.findByPk(id);

    if (!category) {
      const error = new Error('Catalogue category not found.');
      error.status = 404;
      throw error;
    }

    return category;
  } catch (error) {
    console.error('Catalogue category findById error:', error);

    throw error;
  }
};


/**
 * Create category.
 */
export const create = async (data, image = null) => {
  try {
    if (!data.name?.trim()) {
      const error = new Error('Category name is required.');
      error.status = 422;
      throw error;
    }

    if (!data.slug?.trim()) {
      const error = new Error('Category slug is required.');
      error.status = 422;
      throw error;
    }

    const slug = await ensureUniqueSlug(
      data.slug.trim().toLowerCase()
    );

    const category = await CatalogueCategory.create({
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || null,
      image: image || null,
      is_active:
        data.is_active === undefined
          ? true
          : data.is_active === 'true' || data.is_active === true,
      sort_order: Number(data.sort_order) || 0,
    });

    return category;
  } catch (error) {
    console.error('Catalogue category create error:', error);

    throw error;
  }
};


/**
 * Update category.
 */
export const update = async (id, data, image = null) => {
  try {
    const category = await CatalogueCategory.findByPk(id);

    if (!category) {
      const error = new Error('Catalogue category not found.');
      error.status = 404;
      throw error;
    }

    let slug = category.slug;

    if (data.slug && data.slug !== category.slug) {
      slug = await ensureUniqueSlug(
        data.slug.trim().toLowerCase(),
        id
      );
    }

    const updateData = {
      name: data.name?.trim(),
      slug,
      description: data.description?.trim() || null,
      is_active:
        data.is_active === undefined
          ? category.is_active
          : data.is_active === 'true' || data.is_active === true,
      sort_order:
        data.sort_order !== undefined
          ? Number(data.sort_order) || 0
          : category.sort_order,
    };

    /*
     * Only replace image when a new image was uploaded.
     */
    if (image) {
      updateData.image = image;
    }

    await category.update(updateData);

    return category;
  } catch (error) {
    console.error('Catalogue category update error:', error);

    throw error;
  }
};


/**
 * Delete category.
 */
export const destroy = async (id) => {
  try {
    const category = await CatalogueCategory.findByPk(id);

    if (!category) {
      const error = new Error('Catalogue category not found.');
      error.status = 404;
      throw error;
    }

    /*
     * Delete image from Cloudinary first.
     */
    if (category.image) {
      try {
        const publicId = getPublicIdFromUrl(category.image);

        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error(
          'Cloudinary category image deletion error:',
          cloudinaryError
        );
      }
    }

    await category.destroy();

    return {
      id,
      deleted: true,
    };
  } catch (error) {
    console.error('Catalogue category delete error:', error);

    throw error;
  }
};