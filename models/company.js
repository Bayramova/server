"use strict";

const Sequelize = require("sequelize");
const { Order } = require("./order");
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
      type: Sequelize.STRING
    }
  },
  { timestamps: false }
);

Company.hasMany(Order, {
  foreignKey: "company_id",
  sourceKey: "id",
  allowNull: true,
  defaultValue: null
});

module.exports = Company;
