"use strict";

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const companies = require("./routes/companies");
const services = require("./routes/services");
const users = require("./routes/users");

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("dev"));

app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));

app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/api", users);
app.use("/api", companies);
app.use("/api", services);

app.listen(5000, () => console.log("App is listening on port 5000!"));
