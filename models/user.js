"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    role: {
      type: Sequelize.ENUM("client", "company", "admin"),
      default: "client"
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

module.exports = User;
