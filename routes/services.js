"use strict";

const express = require("express");

const router = express.Router();
const Service = require("../models/service");

router.get("/services", async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (err) {
    res.status(500).json({
      message: "!!!!!!!!!!!!!!!!!!!!!!!!"
    });
    console.log(`Error: ${err}`);
  }
});

module.exports = router;
