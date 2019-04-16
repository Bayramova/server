"use strict";

const express = require("express");

const router = express.Router();
const Company = require("../models/company");

router.get("/companies/:page", async (req, res) => {
  try {
    const limit = 5;
    let offset = 0;
    const data = await Company.findAndCountAll();
    if (data) {
      const { page } = req.params;
      offset = limit * (page - 1);
      const companies = await Company.findAll({
        limit,
        offset
      });
      if (companies) {
        res.json(companies);
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong."
    });
    console.log(`Error: ${err}`);
  }
});

module.exports = router;
