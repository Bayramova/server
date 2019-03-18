const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());

const COMPANIES_DATA = path.join(__dirname, "./data/companies.json");
const SERVICES_DATA = path.join(__dirname, "./data/services.json");


app.get("/api/companies", (req, res) => {
  fs.readFile(COMPANIES_DATA, (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.get("/api/services", (req, res) => {
  fs.readFile(SERVICES_DATA, (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.listen(5000, () => console.log("App is listening on port 5000!"));
