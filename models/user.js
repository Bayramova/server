"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.sequelize.define(
  "user",
  {
    role: {
      type: Sequelize.ENUM("client", "company", "admin"),
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
    }
  },
  {
    timestamps: false
  }
);

User.sync();

module.exports = User;
