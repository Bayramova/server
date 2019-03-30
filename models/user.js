"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");
// const Company = require("../models/company");

const User = db.sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: Sequelize.ENUM("client", "company", "admin"),
    defaultValue: "client"
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// User.belongsTo(Company, {
//   foreignKey: "companyId",
//   as: "company"
// });

module.exports = User;
