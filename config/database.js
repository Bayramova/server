"use strict";

require("dotenv").config();
const Sequelize = require("sequelize");

const db = {};
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      sync: true,
      forceSync: false,
      timestamps: false
    }
  }
);

sequelize.authenticate().then(err => {
  if (err) {
    console.error("Unable to connect to the database:", err);
  } else {
    sequelize.sync();
    console.log("Connection has been established successfully.");
  }
});

db.sequelize = sequelize;

module.exports = db;
