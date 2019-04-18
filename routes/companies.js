/* eslint-disable no-restricted-globals */

"use strict";

const express = require("express");

const router = express.Router();
const Company = require("../models/company");

router.get("/companies/:page/:limit", async (req, res) => {
  try {
    const page = req.params.page || 1;
    let limit = parseInt(req.params.limit, 10);
    if (isNaN(limit)) {
      limit = 5;
    } else if (limit > 50) {
      limit = 50;
    } else if (limit < 1) {
      limit = 1;
    }
    let offset = 0;
    const data = await Company.findAndCountAll();
    if (data) {
      offset = limit * (page - 1);
      const companies = await Company.findAll({
        limit,
        offset
      });
      if (companies) {
        const hasMore = page < Math.ceil(data.count / limit);
        res.json({
          companies,
          currentPage: page,
          pages: Math.ceil(data.count / limit),
          hasMore
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong."
    });
    console.log(`Error: ${err}`);
  }
});

router.get("/company/:id", async (req, res) => {
  try {
    const company = await Company.findOne({
      where: {
        id: req.params.id
      }
    });
    if (company) {
      res.json(company);
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong."
    });
    console.log(`Error: ${err}`);
  }
});

module.exports = router;
