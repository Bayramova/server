/* eslint-disable no-eval */
/* eslint-disable no-unused-vars */

"use strict";

const parseArgs = require("minimist");
const fs = require("fs");
const path = require("path");
const db = require("../config/database");
const Company = require("../models/company");
const Service = require("../models/service");
const Client = require("../models/client");
const { User } = require("../models/user");

let TABLE_NAME = "";
let FILE_NAME = "";

const argv = parseArgs(process.argv, {});
TABLE_NAME = argv.table;
FILE_NAME = argv.filename;

const DATA = path.join(__dirname, `../data/${FILE_NAME}`);

fs.readFile(DATA, async (error, data) => {
  try {
    const records = JSON.parse(data);
    await eval(TABLE_NAME).sync();
    await eval(TABLE_NAME).bulkCreate(records, {
      ignoreDuplicates: true
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});
