"use strict";

/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const { User } = require("../models/user");
const { client } = require("../models/user");
const Client = require("../models/client");
const Company = require("../models/company");
const jwtSecret = require("../config/keys");

router.post("/signup", async (req, res) => {
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
      exp: 3600
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

router.post("/user_from_token", async (req, res) => {
  try {
    console.log(`!!!!!!!!!!!!!!!!!!!!!!!!1 ${req.body}`);
    const token = req.body;
    if (!token) {
      return res.status(401).json({
        message: "Must pass token"
      });
    }
    const decoded = await jwt.verify(token, jwtSecret.secret);
    if (decoded) {
      const user = await User.findOne({
        where: {
          id: decoded.id
        }
      });
      if (user) {
        return res.json({
          success: true,
          token: `Bearer ${token}`,
          user
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/user/:id", async (req, res) => {
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

router.put("/user/:id/edit", async (req, res) => {
  // const user = await User.findOne({
  //   where: {
  //     email: req.body.email
  //   }
  // });
  // if (user) {
  //   return res.status(400).json({ email: "Email already exists!" });
  // }

  // const salt = await bcrypt.genSalt(10);
  // const hash = await bcrypt.hash(req.body.password, salt);
  // const updatedUser = await User.update(
  //   {
  //     // email: req.body.email,
  //     password: hash
  //   },
  //   {
  //     where: {
  //       id: req.params.id
  //     }
  //   }
  // );
  // if (updatedUser) {
  //   const user = await User.findOne({
  //     where: {
  //       id: req.params.id
  //     }
  //   });
  //   const updatedUser = await Client.update(
  //     {
  //       name: req.body.name,
  //       address: req.body.address
  //     },
  //     {
  //       where: {
  //         id: user.client_id
  //       }
  //     }
  //   );
  //   return res.send(updatedUser);
  // } catch (error) {
  //   console.log(error);
  // }
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    if (user) {
      if (user.role === client) {
        const updatedUserData = await Client.update(
          {
            name: req.body.name,
            address: req.body.address
          },
          {
            where: {
              id: user.client_id
            }
          }
        );
        return res.json({
          updatedUserData
        });
      }
      const updatedUserData = await Company.update(
        {
          logo: req.body.logo,
          name: req.body.name,
          address: req.body.address,
          services: req.body.services
        },
        {
          where: {
            id: user.company_id
          }
        }
      );
      return res.json({
        updatedUserData
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
