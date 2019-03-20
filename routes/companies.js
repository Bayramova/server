const express = require("express");
const router = express.Router();
const db = require('../database/db');
const Company = require("../models/company");

router.get("/companies", (req, res) => {
  Company.findAll().then(companies => {
    res.json(companies);
  })
  .catch(err => console.log("Error: " + err));
});

module.exports = router;
