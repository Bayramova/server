const Sequelize = require("sequelize");
const db = require('../database/db');

module.exports = db.sequelize.define(
  'service',
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    image: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    }
  },
)
