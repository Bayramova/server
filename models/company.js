"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");

const Company = db.sequelize.define("company", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  logo: {
    type: Sequelize.STRING,
    defaultValue: "./img/logo/question-solid.svg"
  },
  name: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  rating: {
    type: Sequelize.INTEGER
  },
  ordersNumber: {
    type: Sequelize.INTEGER
  },
  services: {
    type: Sequelize.STRING,
    get() {
      return this.getDataValue("services").split(",");
    },
    set(val) {
      this.setDataValue("services", val.join(","));
    }
  },
  reviewsNumber: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

module.exports = Company;
