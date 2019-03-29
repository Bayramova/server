"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");
const User = require("../models/user");

const Company = db.sequelize.define("company", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: "company"
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  logo: {
    type: Sequelize.STRING,
    defaultValue: "./img/logo/dice-two-solid.svg"
  },
  name: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  rating: {
    type: Sequelize.STRING
  },
  orders: {
    type: Sequelize.STRING
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
});

Company.hasMany(User, {
  as: "employees",
  foreignKey: "companyId",
  sourceKey: "id"
});

module.exports = Company;
