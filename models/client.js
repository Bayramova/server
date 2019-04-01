"use strict";

const Sequelize = require("sequelize");
const uuid = require("uuid/v4");
const db = require("../config/database");

const Client = db.sequelize.define("client", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: uuid()
  },
  name: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  }
});

module.exports = Client;
