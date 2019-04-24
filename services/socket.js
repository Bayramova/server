/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const { Order } = require("../models/order");
const Company = require("../models/company");
const { User } = require("../models/user");

module.exports = (socket, io) => {
  socket.on("disconnect", () => {
    console.log(`Socket connection has disconnected!`);
  });

  socket.on("userId", id => {
    socket.join(id);
  });

  socket.on("new order", async data => {
    try {
      const newOrder = await Order.create({
        address: data.address,
        service: data.service,
        bigRooms: data.bigRooms,
        smallRooms: data.smallRooms,
        bathrooms: data.bathrooms,
        daysOfCleaning: data.daysOfCleaning,
        startTimeOfCleaning: data.startTimeOfCleaning,
        cleaningFrequency: data.cleaningFrequency,
        prefix: data.prefix,
        phone: data.phone,
        name: data.name,
        cost: data.cost,
        client_id: data.clientId,
        company_id: data.companyId
      });
      if (newOrder) {
        const company = await Company.findOne({
          where: {
            id: newOrder.company_id
          }
        });
        if (company) {
          company.ordersNumber += 1;
          company.save();
          const user = await User.findOne({
            where: {
              company_id: newOrder.company_id
            }
          });
          if (user) {
            io.sockets.in(user.id).emit("show notification");
          }
        }
      }
    } catch (error) {
      console.error(error);
      socket.emit("error", error);
    }
  });
};
