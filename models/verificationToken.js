"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");
const { User } = require("./user");

const VerificationToken = db.sequelize.define(
  "verificationToken",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: Sequelize.STRING
    }
  },
  { timestamps: false }
);

User.hasOne(VerificationToken, {
  foreignKey: "user_id",
  targetKey: "id"
});

module.exports = VerificationToken;
