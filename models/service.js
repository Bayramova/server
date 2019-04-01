"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");

const Service = db.sequelize.define(
  "service",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    image: {
      type: Sequelize.STRING
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    }
  },
  { timestamps: false }
);

module.exports = Service;
