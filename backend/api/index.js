require('dotenv').config();

const app = require('../src/app');
const connectDB = require('../src/config/db');

let databaseReadyPromise;

const ensureDatabase = () => {
  if (!databaseReadyPromise) {
    databaseReadyPromise = connectDB();
  }

  return databaseReadyPromise;
};

module.exports = async (req, res) => {
  await ensureDatabase();
  return app(req, res);
};
