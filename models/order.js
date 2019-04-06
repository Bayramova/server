"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");

const ordered = "new";
const confirmed = "confirmed";
const cancelled = "cancelled";
const done = "done";

const Order = db.sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: Sequelize.ENUM(ordered, confirmed, cancelled, done),
    defaultValue: ordered
  },
  address: {
    type: Sequelize.STRING
  },
  service: {
    type: Sequelize.STRING
  },
  bigRooms: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  smallRooms: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  bathrooms: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  daysOfCleaning: {
    type: Sequelize.STRING,
    get() {
      return this.getDataValue("daysOfCleaning").split(",");
    },
    set(val) {
      this.setDataValue("daysOfCleaning", val.join(","));
    }
  },
  startTimeOfCleaning: {
    type: Sequelize.STRING,
    defaultValue: "09:00-12:00"
  },
  cleaningFrequency: {
    type: Sequelize.STRING,
    defaultValue: "only once"
  },
  phone: {
    type: Sequelize.STRING
  }
});

module.exports = { Order, ordered, confirmed, cancelled, done };