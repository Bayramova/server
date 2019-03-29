"use strict";

const Sequelize = require("sequelize");
const db = require("../config/database");
// const Company = require("../models/company");

const User = db.sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
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
  },
  name: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.STRING
  },
  companyId: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

User.associate = function(models) {
  User.belongsTo(models.Company, {
    foreignKey: "companyId",
    as: "company"
  });
};

// User.belongsTo(Company, {
//   foreignKey: "companyId",
//   as: "company"
// });

// User.associate(db.sequelize.models);

module.exports = User;
