"use strict";

const express = require("express");

const router = express.Router();
const Client = require("../models/client");

router.get("/clients", async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong."
    });
    console.log(`Error: ${err}`);
  }
});

module.exports = router;
