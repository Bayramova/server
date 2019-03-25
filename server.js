/* eslint-disable no-console */
const express = require("express");

const cors = require("cors");
const companies = require("./routes/companies");
const services = require("./routes/services");

const app = express();
app.use(cors());

app.get("/", (req, res) => res.send("Hello"));
app.use("/api", companies);
app.use("/api", services);

app.listen(5000, () => console.log("App is listening on port 5000!"));
