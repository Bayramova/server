"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");
const Company = require("../models/company");
const Client = require("../models/client");

// TODO константы обычно называются большими буквами CLIENT = "CLIENT"
const client = "client";
const company = "company";
const admin = "admin";

const User = db.sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: Sequelize.ENUM(client, company, admin),
    defaultValue: client
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

User.belongsTo(Client, {
  foreignKey: "client_id",
  targetKey: "id",
  allowNull: true,
  defaultValue: null
});

User.belongsTo(Company, {
  foreignKey: "company_id",
  targetKey: "id",
  allowNull: true,
  defaultValue: null
});

module.exports = { User, client, company };
