"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");

const Feedback = db.sequelize.define("feedback", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rate: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  feedback: {
    type: Sequelize.STRING
  }
});

module.exports = Feedback;
