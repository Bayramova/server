/* eslint-disable no-else-return */
/* eslint-disable consistent-return */

"use strict";

const jwtDecode = require("jwt-decode");
const { User, CLIENT } = require("../models/user");
const Company = require("../models/company");
const Client = require("../models/client");
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
    // TODO логика проверки токена не относиться к созданию заказа, это отдельная ф-ция. Или можно заюзать middleware https://github.com/erreina/passport-jwt.socketio
    if (data.token) {
      const user = await User.findOne({
        where: {
          client_id: data.clientId
        }
      });
      if (user) {
        // TODO это проверка просто расшифрует payload и сравнит id. А нам надо сравнить подписи jwt.verify
        if (jwtDecode(data.isAuthorized).id !== user.id) {
          return {
            message: "Ooops. You don't have rights to visit this page."
          };
        }
      }
    }
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
      // TODO можно ли юзера достать вместе с компанией, чтобы не делать доп запрос?
      const company = await Company.findOne({
        where: {
          id: newOrder.company_id
        }
      });
      if (company) {
        company.ordersNumber += 1;
        company.save();
        // TODO эта проверка уже есть на 56 строчке
        if (newOrder) {
          const user = await User.findOne({
            where: {
              company_id: newOrder.company_id
            }
          });
          if (user) {
            return user;
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    return { message: "Order failed." };
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
              },
              include: [Company]
            })
          : await Order.findAll({
              where: {
                company_id: user.company_id
              },
              include: [Company]
            });
      if (orders) {
        return orders;
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
      },
      include: [
        {
          model: Company,
          include: [
            {
              model: User
            }
          ]
        },
        {
          model: Client,
          include: [
            {
              model: User
            }
          ]
        }
      ]
    });
    if (order) {
      if (order.client.user.id !== id && order.company.user.id !== id) {
        return res.status(403).json({
          message: "Ooops. You don't have rights to visit this page."
        });
      } else {
        order.status = CANCELLED;
        const cancelledOrder = await order.save();
        if (cancelledOrder) {
          cancelledOrder.company.ordersNumber -= 1;
          cancelledOrder.company.save();
          return {
            message: "Order cancelled."
          };
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
      },
      include: [
        {
          model: Company,
          include: [
            {
              model: User
            }
          ]
        }
      ]
    });
    if (order) {
      if (order.company.user.id !== id) {
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
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong." };
  }
};

module.exports = { makeOrder, getOrders, cancelOrder, changeOrderStatus };
