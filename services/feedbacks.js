/* eslint-disable consistent-return */
/* eslint-disable no-else-return */

"use strict";

const { User } = require("../models/user");
const Client = require("../models/client");
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
        },
        include: [
          { model: Company },
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
        if (order.client.user.id !== id) {
          return res.status(403).json({
            message: "Ooops. You don't have rights to visit this page."
          });
        } else {
          const { company } = order;
          company.reviewsNumber += 1;
          company.rating += newFeedback.rate;
          company.save();
          order.feedbackLeft = true;
          order.save();
          return newFeedback;
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
    const feedbacks = await Feedback.findAll({
      include: [
        {
          model: Order,
          include: [
            {
              model: Company,
              where: {
                id
              }
            }
          ]
        }
      ]
    });
    if (feedbacks) {
      return feedbacks.filter(feedback => feedback.order);
    }
  } catch (err) {
    console.log(`Error: ${err}`);
    return { success: false, message: "Something went wrong." };
  }
};

module.exports = { leaveFeedback, getFeedbacks };
