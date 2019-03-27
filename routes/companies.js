"use strict";

const express = require("express");

const router = express.Router();
const Company = require("../models/company");

router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

module.exports = router;
