/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
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
      const company = await makeOrder(data);
      if (company) {
        io.sockets.in(company.id).emit("show notification");
      }
    } catch (error) {
      console.error(error);
      socket.emit("error", error);
    }
  });
};
