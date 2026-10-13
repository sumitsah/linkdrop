// Runtime settings. Everything the app needs from its environment is read here.
module.exports = {
  host: process.env.HOST || 'localhost',
  port: 8080,
  databaseUrl: process.env.PG_URL,
  pageSize: 20,
};
