"use strict";

const express = require("express");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const companies = require("./routes/companies");
const services = require("./routes/services");
const users = require("./routes/users");
const socketService = require("./services/socket-io");
// const Order = require("./models/order");

// // const GET_REQUEST_ORDERS = "GET_REQUEST_ORDERS";
// const GET_SUCCESS_ORDERS = "GET_SUCCESS_ORDERS";
// const GET_FAILURE_ORDERS = "GET_FAILURE_ORDERS";

// const getOrders = async socket => {
//   try {
//     const orders = await Order.findAll();
//     if (orders) {
//       socket.emit(GET_SUCCESS_ORDERS, orders);
//     }
//   } catch (err) {
//     socket.emit(GET_FAILURE_ORDERS, err);
//   }
// };

server.listen(5000, () => console.log("App is listening on port 5000!"));

io.on("connection", socketService);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("dev"));

app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/api", users);
app.use("/api", companies);
app.use("/api", services);
