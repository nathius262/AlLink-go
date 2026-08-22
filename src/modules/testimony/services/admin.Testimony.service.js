import db from '../../../models/index.cjs';

import { getPublicIdFromUrl } from '../../../utils/utils.js';

import cloudinary from '../../../config/cloudinaryConfig.js';

const { Testimony } = db;


/**
 * Find all testimonies.
 */
export const findAll = async ({ limit, offset }) => {
  try {
    const {
      rows: testimonies,
      count: totalItems,
    } = await Testimony.findAndCountAll({
      limit,
      offset,
      order: [
        ['sort_order', 'ASC'],
        ['created_at', 'DESC'],
      ],
    });

    return {
      testimonies,
      totalItems,
      totalPages: limit
        ? Math.ceil(totalItems / limit)
        : 1,
    };
  } catch (error) {
    console.error(
      'Testimony findAll error:',
      error
    );

    throw new Error(
      `Error fetching testimonies: ${error.message}`
    );
  }
};


/**
 * Find testimony by ID.
 */
export const findById = async (id) => {
  try {
    const testimony = await Testimony.findByPk(id);

    if (!testimony) {
      const error = new Error(
        'Testimony not found.'
      );

      error.status = 404;

      throw error;
    }

    return testimony;
  } catch (error) {
    console.error(
      'Testimony findById error:',
      error
    );

    throw error;
  }
};


/**
 * Create testimony.
 */
export const create = async (
  data,
  image = null
) => {
  try {
    if (!data.name?.trim()) {
      const error = new Error(
        'Testimony name is required.'
      );

      error.status = 422;

      throw error;
    }

    if (!data.content?.trim()) {
      const error = new Error(
        'Testimony content is required.'
      );

      error.status = 422;

      throw error;
    }


    /**
     * Validate rating when supplied.
     */
    let rating = null;

    if (
      data.rating !== undefined &&
      data.rating !== ''
    ) {
      rating = Number(data.rating);

      if (
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
      ) {
        const error = new Error(
          'Rating must be an integer between 1 and 5.'
        );

        error.status = 422;

        throw error;
      }
    }


    const testimony = await Testimony.create({
      name: data.name.trim(),

      role:
        data.role?.trim() || null,

      company:
        data.company?.trim() || null,

      content:
        data.content.trim(),

      image:
        image || null,

      rating,

      is_featured:
        data.is_featured === undefined
          ? false
          : data.is_featured === 'true' ||
          data.is_featured === true ||
          data.is_featured == 1,

      is_active:
        data.is_active === undefined
          ? true
          : data.is_active === 'true' ||
          data.is_active === true ||
          data.is_active == 1,

      sort_order:
        Number(data.sort_order) || 0,
    });

    return testimony;
  } catch (error) {
    console.error(
      'Testimony create error:',
      error
    );

    throw error;
  }
};


/**
 * Update testimony.
 */
export const update = async (
  id,
  data,
  image = null
) => {
  try {
    const testimony =
      await Testimony.findByPk(id);

    if (!testimony) {
      const error = new Error(
        'Testimony not found.'
      );

      error.status = 404;

      throw error;
    }


    /**
     * Validate rating when supplied.
     */
    let rating = testimony.rating;

    if (
      data.rating !== undefined &&
      data.rating !== ''
    ) {
      rating = Number(data.rating);

      if (
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
      ) {
        const error = new Error(
          'Rating must be an integer between 1 and 5.'
        );

        error.status = 422;

        throw error;
      }
    } else if (
      data.rating === ''
    ) {
      rating = null;
    }


    const updateData = {
      name:
        data.name?.trim(),

      role:
        data.role?.trim() || null,

      company:
        data.company?.trim() || null,

      content:
        data.content?.trim(),

      rating,

      is_featured:
        data.is_featured === undefined
          ? testimony.is_featured
          : data.is_featured === 'true' ||
          data.is_featured === true ||
          data.is_featured == 1,

      is_active:
        data.is_active === undefined
          ? testimony.is_active
          : data.is_active === 'true' ||
          data.is_active === true ||
          data.is_active == 1,

      sort_order:
        data.sort_order !== undefined
          ? Number(data.sort_order) || 0
          : testimony.sort_order,
    };


    /**
     * Only replace image when
     * a new image was uploaded.
     */
    if (image) {
      updateData.image = image;
    }


    /**
     * If a new image was uploaded,
     * remove the previous image from
     * Cloudinary.
     */
    if (image && testimony.image) {
      try {
        const publicId =
          getPublicIdFromUrl(
            testimony.image
          );

        if (publicId) {
          await cloudinary.uploader.destroy(
            publicId
          );
        }
      } catch (cloudinaryError) {
        console.error(
          'Cloudinary testimony image replacement error:',
          cloudinaryError
        );
      }
    }


    await testimony.update(
      updateData
    );

    return testimony;
  } catch (error) {
    console.error(
      'Testimony update error:',
      error
    );

    throw error;
  }
};


/**
 * Delete testimony.
 */
export const destroy = async (id) => {
  try {
    const testimony =
      await Testimony.findByPk(id);

    if (!testimony) {
      const error = new Error(
        'Testimony not found.'
      );

      error.status = 404;

      throw error;
    }


    /**
     * Delete image from Cloudinary first.
     */
    if (testimony.image) {
      try {
        const publicId =
          getPublicIdFromUrl(
            testimony.image
          );

        if (publicId) {
          await cloudinary.uploader.destroy(
            publicId
          );
        }
      } catch (cloudinaryError) {
        console.error(
          'Cloudinary testimony image deletion error:',
          cloudinaryError
        );
      }
    }


    await testimony.destroy();

    return {
      id,
      deleted: true,
    };
  } catch (error) {
    console.error(
      'Testimony delete error:',
      error
    );

    throw error;
  }
};