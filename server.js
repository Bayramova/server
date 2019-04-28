"use strict";

const express = require("express");

const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const io = require("socket.io")(server);
const path = require("path");
const companies = require("./routes/companies");
const services = require("./routes/services");
const users = require("./routes/users");
const socketService = require("./services/socket");

io.on("connection", socket => {
  console.log("Socket connection started!");
  socketService(socket, io);
});

server.listen(5000, () => console.log("App is listening on port 5000!"));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "client/build")));

app.use(morgan("dev"));

app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/api", users);
app.use("/api", companies);
app.use("/api", services);
