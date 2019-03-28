"use strict";

/* eslint-disable no-eval */
/* eslint-disable no-unused-vars */

const parseArgs = require("minimist");
const fs = require("fs");
const path = require("path");
const db = require("../config/database");
const companies = require("../models/company");
const services = require("../models/service");
const clients = require("../models/client");

let TABLE_NAME = "";
let FILE_NAME = "";

const argv = parseArgs(process.argv, {});
TABLE_NAME = argv.table;
FILE_NAME = argv.filename;

const DATA = path.join(__dirname, `../data/${FILE_NAME}`);

fs.readFile(DATA, async (error, data) => {
  try {
    const records = JSON.parse(data);
    await eval(TABLE_NAME).sync({});
    await eval(TABLE_NAME).bulkCreate(records, {
      ignoreDuplicates: true
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

// db.sequelize
//   .query(
//     `CREATE TABLE IF NOT EXISTS users AS SELECT email, password, role FROM companies`
//   )
//   .then(data => {
//     db.sequelize.query(
//       `INSERT INTO users SELECT email, password, role FROM clients`
//     );
//   });
