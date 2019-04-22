/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const { Order } = require("../models/order");
const Company = require("../models/company");

module.exports = socket => {
  socket.on("disconnect", () => {
    console.log(`Socket connection has disconnected!`);
  });

  socket.on("join", companyId => {
    socket.join(companyId);
  });

  socket.on("new_order", async data => {
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
          socket.broadcast.emit("show_notification");
        }
      }
    } catch (error) {
      console.error(error);
      socket.emit("error");
    }
    // socket.broadcast.to(newOrder.company_id).emit("show_notification");
  });
};
