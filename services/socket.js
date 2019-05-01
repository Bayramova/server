/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/keys");
const { makeOrder } = require("./orders");

module.exports = (socket, io) => {
  socket.on("disconnect", () => {
    console.log(`Socket connection has disconnected!`);
  });

  socket.on("join", id => {
    socket.join(id);
  });

  socket.on("leave", id => {
    socket.leave(id);
  });

  socket.on("new order", async data => {
    try {
      let decoded;
      if (data.token) {
        decoded = jwt.verify(data.token, jwtSecret.secret).id;
      }
      const company = await makeOrder(data, decoded);
      if (company) {
        io.sockets.in(company.id).emit("show notification");
      }
    } catch (error) {
      console.error(error);
      socket.emit("error", error);
    }
  });
};
