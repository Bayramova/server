/* eslint-disable no-inner-declarations */
/* eslint-disable eqeqeq */

"use strict";

/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { client } = require("../models/user");
const Client = require("../models/client");
const Company = require("../models/company");
const {
  Order,
  ordered,
  confirmed,
  cancelled,
  done
} = require("../models/order");
const Feedback = require("../models/feedback");
const jwtSecret = require("../config/keys");
const checkAuth = require("../middleware/checkAuth");

router.post("/signup", async (req, res) => {
  // TODO бизнес логика должна быть не в роутах, а в сервисах(между моделями и роутами, должен быть слой сервисов)
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (user) {
      return res.status(400).json({ email: "Email already exists!" });
    }

    const newUser = User.build({
      role: req.body.role,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    if (req.body.role === client) {
      const newClient = await Client.create({
        name: req.body.name,
        address: req.body.address
      });
      if (newClient) {
        newUser.client_id = newClient.id;
      }
    } else {
      const newCompany = await Company.create({
        logo: req.body.logo,
        name: req.body.name,
        address: req.body.address,
        services: req.body.services
      });
      if (newCompany) {
        newUser.company_id = newCompany.id;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    const registeredUser = newUser.save();
    if (registeredUser) {
      // TODO ты тут случайно пароль на фронт не отправляешь?
      res.json(registeredUser);
    }
  } catch (error) {
    console.error(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) {
      return res.status(400).json({ emailincorrect: "No such user!" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ passwordincorrect: "Incorrect password!" });
    }

    const payload = {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    };
    const token = jwt.sign(payload, jwtSecret.secret);

    const { id, email, role } = user.dataValues;

    return res.json({
      success: true,
      token: `Bearer ${token}`,
      user: { id, email, role }
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/user/:id", checkAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    if (user) {
      if (user.role === client) {
        const userData = await Client.findOne({
          where: {
            id: user.client_id
          }
        });
        return res.json({
          userData
        });
      }
      const userData = await Company.findOne({
        where: {
          id: user.company_id
        }
      });
      return res.json({
        userData
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/from/token", checkAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.id
      }
    });
    if (user) {
      const { id, email, role } = user.dataValues;
      return res.json({
        user: { id, email, role }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/user/:id/edit", checkAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (user && user.id != req.params.id) {
      return res.status(400).json({ email: "Email already exists!" });
    }

    const userToUpdate = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    if (userToUpdate) {
      userToUpdate.email = req.body.email;
      const updatedUser = await userToUpdate.save();
      if (updatedUser.role === client) {
        const clientToUpdate = await Client.findOne({
          where: {
            id: updatedUser.client_id
          }
        });
        if (clientToUpdate) {
          clientToUpdate.name = req.body.name;
          clientToUpdate.address = req.body.address;
          await clientToUpdate.save();
          return res.json({
            message: "User data updated."
          });
        }
      }
      const companyToUpdate = await Company.findOne({
        where: {
          id: updatedUser.company_id
        }
      });
      if (companyToUpdate) {
        companyToUpdate.name = req.body.name;
        companyToUpdate.address = req.body.address;
        companyToUpdate.services = req.body.services;
        await companyToUpdate.save();
        return res.json({
          message: "User data updated."
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/make_order", async (req, res) => {
  try {
    const newOrder = await Order.create({
      address: req.body.address,
      service: req.body.service,
      bigRooms: req.body.bigRooms,
      smallRooms: req.body.smallRooms,
      bathrooms: req.body.bathrooms,
      daysOfCleaning: req.body.daysOfCleaning,
      startTimeOfCleaning: req.body.startTimeOfCleaning,
      cleaningFrequency: req.body.cleaningFrequency,
      prefix: req.body.prefix,
      phone: req.body.phone,
      cost: req.body.cost,
      client_id: req.body.clientId,
      company_id: req.body.companyId
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
        res.json(newOrder);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/user/:id/orders", checkAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    if (user) {
      if (user.role === client) {
        const orders = await Order.findAll({
          where: {
            client_id: user.client_id
          }
        });
        return res.json(orders);
      }
      const orders = await Order.findAll({
        where: {
          company_id: user.company_id
        }
      });
      return res.json(orders);
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

router.put("/cancel/:orderId", checkAuth, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.orderId
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
        if (client.id !== req.id && company.id !== req.id) {
          res.json({
            message: "Ooops."
          });
        } else {
          order.status = cancelled;
          const cancelledOrder = await order.save();
          if (cancelledOrder) {
            const company = await Company.findOne({
              where: {
                id: cancelledOrder.company_id
              }
            });
            if (company) {
              company.ordersNumber -= 1;
              company.save();
              return res.json({
                message: "Order cancelled."
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/change_status/:orderId", checkAuth, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.orderId
      }
    });
    if (order) {
      const company = await User.findOne({
        where: {
          company_id: order.company_id
        }
      });
      if (company) {
        if (company.id !== req.id) {
          // TODO информативно) и тут наверно стоило бы другой http код отправить 403 или 422
          res.json({
            message: "Ooops."
          });
        } else {
          // TODO стоит вынести ф-цию из роута
          function switchResult(result) {
            switch (result) {
              case ordered:
                return confirmed;
              case confirmed:
                return done;
              default:
                return done;
            }
          }
          order.status = switchResult(order.status);
          const updatedOrderStatus = await order.save();
          if (updatedOrderStatus) {
            return res.json({
              message: "Order status updated."
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/leave_feedback", checkAuth, async (req, res) => {
  try {
    const newFeedback = await Feedback.create({
      rate: req.body.rate,
      feedback: req.body.feedback,
      client_id: req.body.clientId,
      company_id: req.body.companyId
    });
    if (newFeedback) {
      const company = await Company.findOne({
        where: {
          id: newFeedback.company_id
        }
      });
      if (company) {
        if (company.rating === null) {
          company.rating += newFeedback.rate;
        } else {
          // TODO 10 человек поставит 5, а потом 1, в срелнем будет 2.5. не надо менять, просто наблюдение)
          company.rating = (company.rating + newFeedback.rate) / 2;
        }
        company.save();
        res.json(newFeedback);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

router.get("/company/:id/feedbacks", async (req, res) => {
  try {
    const company = await Company.findOne({
      where: {
        id: req.params.id
      }
    });
    if (company) {
      const feedbacks = await Feedback.findAll({
        where: {
          company_id: company.id
        }
      });
      return res.json(feedbacks);
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

module.exports = router;
