/* eslint-disable consistent-return */
/* eslint-disable no-else-return */

"use strict";

const { User } = require("../models/user");
const Company = require("../models/company");
const { Feedback, Order } = require("../models/order");

const leaveFeedback = async (id, data, res) => {
  try {
    const newFeedback = await Feedback.create({
      rate: data.rate,
      feedback: data.feedback,
      order_id: data.orderId
    });
    if (newFeedback) {
      const order = await Order.findOne({
        where: {
          id: newFeedback.order_id
        }
      });
      if (order) {
        const client = await User.findOne({
          where: {
            client_id: order.client_id
          }
        });
        if (client) {
          if (client.id !== id) {
            return res.status(403).json({
              message: "Ooops. You don't have rights to visit this page."
            });
          } else {
            const company = await Company.findOne({
              where: {
                id: order.company_id
              }
            });
            if (company) {
              if (company.rating === null) {
                company.rating = newFeedback.rate;
              } else {
                company.rating = (company.rating + newFeedback.rate) / 2;
              }
              company.save();
              order.feedbackLeft = true;
              order.save();
              return newFeedback;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong." };
  }
};

const getFeedbacks = async id => {
  try {
    const company = await Company.findOne({
      where: {
        id
      }
    });
    if (company) {
      const feedbacks = await Feedback.findAll({
        include: [
          {
            model: Order,
            where: {
              company_id: company.id
            }
          }
        ]
      });
      return feedbacks;
    }
  } catch (err) {
    console.log(`Error: ${err}`);
    return { success: false, message: "Something went wrong." };
  }
};

module.exports = { leaveFeedback, getFeedbacks };
