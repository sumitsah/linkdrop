// Runtime settings. Everything the app needs from its environment is read here.
module.exports = {
  host: process.env.HOST || 'localhost',
  port: 3000,
  databaseUrl: process.env.PG_URL,
  pageSize: 20,
};
