/* eslint-disable no-else-return */
/* eslint-disable consistent-return */

"use strict";

const { User } = require("../models/user");
const { CLIENT } = require("../models/user");
const Company = require("../models/company");
const { Order, NEW, CONFIRMED, CANCELLED, DONE } = require("../models/order");

function switchResult(result) {
  switch (result) {
    case NEW:
      return CONFIRMED;
    case CONFIRMED:
      return DONE;
    default:
      return NEW;
  }
}

const makeOrder = async data => {
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
        return newOrder;
      }
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Order failed." };
  }
};

const getOrders = async id => {
  try {
    const user = await User.findOne({
      where: {
        id
      }
    });
    if (user) {
      const orders =
        user.role === CLIENT
          ? await Order.findAll({
              where: {
                client_id: user.client_id
              }
            })
          : await Order.findAll({
              where: {
                company_id: user.company_id
              }
            });
      if (orders) {
        const ordersInfo = await Promise.all(
          orders.map(async order => {
            const company = await Company.findOne({
              where: {
                id: order.company_id
              }
            });
            if (company) {
              return {
                ...order.dataValues,
                company_name: company.name
              };
            }
          })
        );
        if (ordersInfo) {
          return ordersInfo;
        }
      }
    }
  } catch (err) {
    console.log(`Error: ${err}`);
    return { success: false, message: "Something went wrong." };
  }
};

const cancelOrder = async (params, id, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: params.orderId
      }
    });
    if (order) {
      const client = await User.findOne({
        where: {
          client_id: order.client_id
        }
      });
      const company = await User.findOne({
        where: {
          company_id: order.company_id
        }
      });
      if (client && company) {
        if (client.id !== id && company.id !== id) {
          return res.status(403).json({
            message: "Ooops. You don't have rights to visit this page."
          });
        } else {
          order.status = CANCELLED;
          const cancelledOrder = await order.save();
          if (cancelledOrder) {
            const cancelled = await Company.findOne({
              where: {
                id: cancelledOrder.company_id
              }
            });
            if (cancelled) {
              cancelled.ordersNumber -= 1;
              cancelled.save();
              return {
                message: "Order cancelled."
              };
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong." };
  }
};

const changeOrderStatus = async (params, id, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: params.orderId
      }
    });
    if (order) {
      const company = await User.findOne({
        where: {
          company_id: order.company_id
        }
      });
      if (company) {
        if (company.id !== id) {
          return res.status(403).json({
            message: "Ooops. You don't have rights to visit this page."
          });
        } else {
          order.status = switchResult(order.status);
          const updatedOrderStatus = await order.save();
          if (updatedOrderStatus) {
            return {
              message: "Order status updated."
            };
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong." };
  }
};

module.exports = { makeOrder, getOrders, cancelOrder, changeOrderStatus };
