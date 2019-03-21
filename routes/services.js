const express = require("express");
const router = express.Router();
const db = require('../database/db');
const Service = require("../models/service");

router.get("/services", (req, res) => {
  Service.findAll().then(services => {
    res.json(services);
  })
  .catch(err => console.log("Error: " + err));
});

module.exports = router;