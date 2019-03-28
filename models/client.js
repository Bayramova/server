"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");

const Client = db.sequelize.define(
  "client",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role: {
      type: Sequelize.STRING,
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
    },
    name: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
);

module.exports = Client;
