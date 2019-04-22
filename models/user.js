"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");
const Company = require("../models/company");
const Client = require("../models/client");

const CLIENT = "CLIENT";
const COMPANY = "COMPANY";
const ADMIN = "ADMIN";

const User = db.sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: Sequelize.ENUM(CLIENT, COMPANY, ADMIN),
    defaultValue: CLIENT
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

Client.hasOne(User, {
  foreignKey: "client_id",
  targetKey: "id",
  allowNull: true,
  defaultValue: null
});

Company.hasOne(User, {
  foreignKey: "company_id",
  targetKey: "id",
  allowNull: true,
  defaultValue: null
});

module.exports = { User, CLIENT, COMPANY };
