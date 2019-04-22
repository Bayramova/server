"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");
const Client = require("../models/client");
const Company = require("../models/company");

const NEW = "NEW";
const CONFIRMED = "CONFIRMED";
const CANCELLED = "CANCELLED";
const DONE = "DONE";

const Order = db.sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: Sequelize.ENUM(NEW, CONFIRMED, CANCELLED, DONE),
    defaultValue: NEW
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
  },
  name: {
    type: Sequelize.STRING
  },
  cost: {
    type: Sequelize.INTEGER
  },
  feedbackLeft: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

Order.belongsTo(Client, {
  foreignKey: "client_id",
  targetKey: "id",
  allowNull: true,
  defaultValue: null
});

Order.belongsTo(Company, {
  foreignKey: "company_id",
  targetKey: "id",
  allowNull: true,
  defaultValue: null
});

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

Feedback.belongsTo(Order, {
  foreignKey: "order_id",
  targetKey: "id"
});

module.exports = { Feedback, Order, NEW, CONFIRMED, CANCELLED, DONE };
