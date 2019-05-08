"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");

const Company = db.sequelize.define(
  "company",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    logo: {
      type: Sequelize.STRING,
      defaultValue:
        "https://s3.us-east-2.amazonaws.com/cleaning-services-images-storage/square.jpg"
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
  },
  { timestamps: false }
);

module.exports = Company;
