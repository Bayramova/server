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
    name: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    }
  },
  { timestamps: false }
);

module.exports = Client;
