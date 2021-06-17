require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    }
});

const getExtensions = `
  CREATE EXTENSION IF NOT EXISTS cube;
  CREATE EXTENSION IF NOT EXISTS earthdistance;
`;

// TODO change name back to templates
const createTemplatesDb = `
  CREATE TABLE IF NOT EXISTS templates (
    id CHAR(36) NOT NULL UNIQUE,
    title VARCHAR(100),
    blurb VARCHAR(63000),
    location_id VARCHAR(255),
    published BOOL NOT NULL,
    creator_id CHAR(36) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subject VARCHAR(255),
    content VARCHAR(63000),
    duplicate BOOL NOT NULL,
    duplicated_from CHAR(36)
  );
`;

const createTagsDb = `
  CREATE TABLE IF NOT EXISTS tags (
    template_id CHAR(36) NOT NULL,
    tag VARCHAR(255) NOT NULL,
    CONSTRAINT id_and_tag UNIQUE (template_id, tag)
  );
`;

const createUsersDB = `
  CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  );
`;

const createTemplateRecipientsDB = `
  CREATE TABLE IF NOT EXISTS template_recipients (
    template_id CHAR(36) NOT NULL,
    recipients JSON NOT NULL,
    location_type VARCHAR(100) NOT NULL,
    CONSTRAINT id_and_type UNIQUE (template_id, location_type)
  );
`;

const createBookmarksDB = `
  CREATE TABLE IF NOT EXISTS bookmarks (
    template_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    CONSTRAINT no_dupes UNIQUE (template_id, user_id)
  );
`;

const createCommentsDB = `
  CREATE TABLE IF NOT EXISTS comments (
    id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    template_id CHAR(36) NOT NULL,
    comment VARCHAR(10000) NOT NULL,
    commented_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createAdminsDB = `
  CREATE TABLE IF NOT EXISTS admins (
    user_id CHAR(36) NOT NULL UNIQUE
  );
`;

const createReportedTemplatesDB = `
  CREATE TABLE IF NOT EXISTS reported_templates (
    template_id CHAR(36) NOT NULL,
    reporter_id CHAR(36) NOT NULL,
    reason VARCHAR(10000)
  );
`;

const createReportedUsersDB = `
  CREATE TABLE IF NOT EXISTS reported_users (
    user_id CHAR(36) NOT NULL,
    reporter_id CHAR(36) NOT NULL,
    reason VARCHAR(10000)
  );
`;

const createReportedCommentsDB = `
  CREATE TABLE IF NOT EXISTS reported_comments (
    comment_id CHAR(36) NOT NULL,
    reporter_id CHAR(36) NOT NULL,
    reason VARCHAR(10000)
  );
`;

const createBannedDB = `
  CREATE TABLE IF NOT EXISTS banned (
    email VARCHAR(255) NOT NULL UNIQUE
  );
`;

const createGroupsDB = `
  CREATE TABLE IF NOT EXISTS contact_groups (
    id CHAR(36) NOT NULL UNIQUE,
    creator_id CHAR(36) NOT NULL,
    group_name VARCHAR(10000) NOT NULL,
    members JSON NOT NULL
  );
`;

const createContactsDB = `
  CREATE TABLE IF NOT EXISTS contact_individuals (
    id CHAR(36) NOT NULL,
    creator_id CHAR(36) NOT NULL,
    name VARCHAR(10000),
    email VARCHAR(10000)
  );
`;

const createInsightsDB = `
  CREATE TABLE IF NOT EXISTS insights (
    template_id CHAR(36) NOT NULL UNIQUE,
    view_count INTEGER NOT NULL,
    mail_count INTEGER NOT NULL,
    filter_count INTEGER NOT NULL,
    bookmark_count INTEGER NOT NULL,
    comment_count INTEGER NOT NULL,
    spam_checked BOOL NOT NULL DEFAULT FALSE
  );
`;

const createLocationsDb = `
  CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    lat FLOAT8 NOT NULL,
    lng FLOAT8 NOT NULL
  );
`;

async function createTables() {
  await run(getExtensions);
  await run(createTemplatesDb);
  await run(createTagsDb);
  await run(createUsersDB);
  await run(createTemplateRecipientsDB);
  await run(createBookmarksDB);
  await run(createAdminsDB);
  await run(createReportedTemplatesDB);
  await run(createReportedUsersDB);
  await run(createBannedDB);
  await run(createCommentsDB);
  await run(createReportedCommentsDB);
  await run(createGroupsDB);
  await run(createContactsDB);
  await run(createInsightsDB);
  await run(createLocationsDb);
}

createTables();

async function run(sqlQuery) {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, release) => {
      if (err) {
        reject(err);
      }
      pool
        .query(sqlQuery)
        .then(res => {
          client.release();
          resolve(res);
        })
        .catch(e => {
          client.release();
          reject(e);
        })
    });
  });
};

module.exports = { run };
