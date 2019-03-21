const Sequelize = require("sequelize");
const db = require('../database/db');

module.exports = db.sequelize.define(
  'company',
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    logo: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    rating: {
      type: Sequelize.STRING,
    },
    orders: {
      type: Sequelize.STRING,
    },
    services:  {
       type: Sequelize.STRING,
      get() {
        return this.getDataValue('services').split(',')
      },
      set(val) {
        this.setDataValue('services', val.join(','));
      }
    },
    reviewsNumber: {
      type: Sequelize.STRING,
    },
  },
)
