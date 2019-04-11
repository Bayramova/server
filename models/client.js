"use strict";

const Sequelize = require("sequelize");
const { Order } = require("./order");
const Feedback = require("./feedback");
const db = require("../config/database");

const Client = db.sequelize.define("client", {
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
});

Client.hasMany(Order, {
  foreignKey: "client_id",
  sourceKey: "id",
  allowNull: true,
  defaultValue: null
});

Client.hasMany(Feedback, {
  foreignKey: "client_id",
  sourceKey: "id",
  allowNull: true,
  defaultValue: null
});

module.exports = Client;
