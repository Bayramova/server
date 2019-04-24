/* eslint-disable no-restricted-globals */

"use strict";

const express = require("express");

const router = express.Router();
const {
  getCompanies,
  getCompany,
  searchCompanies
} = require("../services/companies");

router.get("/companies/:page/:limit", async (req, res) => {
  const response = await getCompanies(req.params, res);
  res.json(response);
});

router.get("/company/:id", async (req, res) => {
  const response = await getCompany(req.params, res);
  res.json(response);
});

router.get("/search_companies/:page/:limit", async (req, res) => {
  const response = await searchCompanies(req.query.q, req.params, res);
  res.json(response);
});

module.exports = router;
