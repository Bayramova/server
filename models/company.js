"use strict";

const Sequelize = require("sequelize");
const uuid = require("uuid/v4");
const db = require("../config/database");
// const User = require("./user");

const Company = db.sequelize.define("company", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: uuid()
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

// Company.hasOne(User, {
//   foreignKey: "id",
//   targetKey: "id"
// });

module.exports = Company;
