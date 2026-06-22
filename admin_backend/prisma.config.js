// prisma.config.js
const config = require('config');
const { defineConfig } = require('prisma/config');

// Grabs the DB url directly from your config package hierarchy
const databaseUrl = `postgresql://${config.get('App.DB.User')}:${config.get('App.DB.Password')}@${config.get('App.DB.Host')}:${config.get('App.DB.Port')}/${config.get('App.DB.Database')}?schema=public`;

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});