'use strict';

const bcrypt = require('bcryptjs');
const { randomUUID } = require('node:crypto');
require('dotenv').config();

const DEFAULT_PASSWORD = process.env.USER_ADMIN_PASSWORD;
const ADMIN_EMAIL = process.env.USER_ADMIN_EMAIL;
const ADMIN_USERNAME = process.env.USER_ADMIN_USERNAME;

// Helper: Check if a table exists based on dialect
async function doesTableExist(queryInterface, tableName) {
  const { dialect } = queryInterface.sequelize.options;

  if (dialect === 'postgres') {
    const [result] = await queryInterface.sequelize.query(
      `SELECT to_regclass(:tableName) AS table_name;`,
      {
        replacements: {
          tableName,
        },
      }
    );

    return result[0]?.table_name !== null;
  }

  if (dialect === 'mysql') {
    const [result] = await queryInterface.sequelize.query(
      `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
        AND table_name = :tableName;
      `,
      {
        replacements: {
          tableName,
        },
      }
    );

    return result.length > 0;
  }

  if (dialect === 'sqlite') {
    const [result] = await queryInterface.sequelize.query(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        AND name = :tableName;
      `,
      {
        replacements: {
          tableName,
        },
      }
    );

    return result.length > 0;
  }

  throw new Error(`Unsupported database dialect: ${dialect}`);
}

async function seedAdmin(queryInterface, Sequelize) {
  if (!DEFAULT_PASSWORD) {
    throw new Error(
      'USER_ADMIN_PASSWORD is not defined in the environment variables.'
    );
  }

  if (!ADMIN_EMAIL) {
    throw new Error(
      'USER_ADMIN_EMAIL is not defined in the environment variables.'
    );
  }

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  try {
    /*
     * ------------------------------------------------------
     * Ensure required tables exist
     * ------------------------------------------------------
     */

    const requiredTables = ['roles', 'users', 'user_roles'];

    for (const table of requiredTables) {
      if (!(await doesTableExist(queryInterface, table))) {
        throw new Error(`${table} table does not exist!`);
      }
    }

    /*
     * ------------------------------------------------------
     * Seed Roles
     * ------------------------------------------------------
     */

    const [existingRoles] = await queryInterface.sequelize.query(
      `
        SELECT id, name
        FROM roles
        WHERE name IN ('admin', 'staff', 'user');
      `
    );

    const existingRoleNames = existingRoles.map((role) => role.name);

    const rolesToInsert = ['admin', 'staff', 'user']
      .filter((name) => !existingRoleNames.includes(name))
      .map((name) => ({
        id: randomUUID(),
        name,
        created_at: new Date(),
        updated_at: new Date(),
      }));

    if (rolesToInsert.length > 0) {
      await queryInterface.bulkInsert('roles', rolesToInsert);
    }

    /*
     * ------------------------------------------------------
     * Fetch Roles
     * ------------------------------------------------------
     */

    const [roles] = await queryInterface.sequelize.query(
      `
        SELECT id, name
        FROM roles
        WHERE name IN ('admin', 'staff', 'user');
      `
    );

    /*
     * ------------------------------------------------------
     * Check if Admin already exists
     * ------------------------------------------------------
     */

    const [existingAdmin] = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM users
        WHERE email = :email
        LIMIT 1;
      `,
      {
        replacements: {
          email: ADMIN_EMAIL,
        },
      }
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists. Skipping creation.');
      return;
    }

    /*
     * ------------------------------------------------------
     * Create Admin User
     * ------------------------------------------------------
     */

    const adminUser = {
      id: randomUUID(),
      email: ADMIN_EMAIL,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Username is optional
    if (ADMIN_USERNAME) {
      adminUser.username = ADMIN_USERNAME;
    }

    await queryInterface.bulkInsert('users', [adminUser]);

    /*
     * ------------------------------------------------------
     * Associate Admin with Roles
     * ------------------------------------------------------
     */

    const userRoles = roles.map((role) => ({
      id: randomUUID(),
      user_id: adminUser.id,
      role_id: role.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('user_roles', userRoles);

    console.log('Admin user and roles created successfully.');
  } catch (err) {
    console.error('Error seeding admin:', err);
    throw err;
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await seedAdmin(queryInterface, Sequelize);
  },

  down: async (queryInterface, Sequelize) => {
    /*
     * ------------------------------------------------------
     * Find Admin
     * ------------------------------------------------------
     */

    const [adminUsers] = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM users
        WHERE email = :email
        LIMIT 1;
      `,
      {
        replacements: {
          email: ADMIN_EMAIL,
        },
      }
    );

    if (adminUsers.length === 0) {
      console.log('Admin user does not exist. Nothing to undo.');
      return;
    }

    const adminUserId = adminUsers[0].id;

    /*
     * ------------------------------------------------------
     * Delete User Roles
     * ------------------------------------------------------
     */

    const [roles] = await queryInterface.sequelize.query(
      `
        SELECT id
        FROM roles
        WHERE name IN ('admin', 'staff', 'user');
      `
    );

    const roleIds = roles.map((role) => role.id);

    if (roleIds.length > 0) {
      await queryInterface.bulkDelete('user_roles', {
        user_id: adminUserId,
        role_id: {
          [Sequelize.Op.in]: roleIds,
        },
      });
    }

    /*
     * ------------------------------------------------------
     * Delete Admin User
     * ------------------------------------------------------
     */

    await queryInterface.bulkDelete('users', {
      id: adminUserId,
    });

    /*
     * ------------------------------------------------------
     * Delete Roles That Are No Longer Used
     * ------------------------------------------------------
     */

    const [unusedRoles] = await queryInterface.sequelize.query(
      `
        SELECT r.id, r.name
        FROM roles r
        LEFT JOIN user_roles ur
          ON r.id = ur.role_id
        WHERE r.name IN ('admin', 'staff', 'user')
        GROUP BY r.id, r.name
        HAVING COUNT(ur.user_id) = 0;
      `
    );

    const unusedRoleIds = unusedRoles.map((role) => role.id);

    if (unusedRoleIds.length > 0) {
      await queryInterface.bulkDelete('roles', {
        id: {
          [Sequelize.Op.in]: unusedRoleIds,
        },
      });
    }

    console.log('Admin user and associated roles removed successfully.');
  },
};