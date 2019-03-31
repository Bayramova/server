"use strict";

/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Client = require("../models/client");
const Company = require("../models/company");
const jwtSecret = require("../config/keys");

router.post("/signup", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists!" });
    }

    const newUser = User.build({
      role: req.body.role,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    // const newRole =
    //   req.body.role === "client"
    //     ? Client.create({
    //         name: req.body.name,
    //         address: req.body.address
    //       })
    //     : Company.create({
    //         logo: req.body.logo,
    //         name: req.body.name,
    //         address: req.body.address,
    //         services: req.body.services
    //       });

    if (req.body.role === "client") {
      const newClient = Client.create({
        name: req.body.name,
        address: req.body.address
      });
      // newUser.id = newClient.id;
      newUser.setClient(newClient, { save: false });
    } else {
      const newCompany = Company.create({
        logo: req.body.logo,
        name: req.body.name,
        address: req.body.address,
        services: req.body.services
      });
      // newUser.id = newCompany.id;
      newUser.setClient(newCompany, { save: false });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            res.json(user);
          })
          .catch(err => console.log(err));
      });
    });
  });
});

router.post("/signin", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (!user) {
      return res.status(400).json({ emailincorrect: "No such user!" });
    }

    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          email: user.email,
          role: user.role
        };

        jwt.sign(
          payload,
          jwtSecret.secret,
          {
            expiresIn: "1h"
          },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Incorrect password!" });
      }
    });
  });
});

module.exports = router;
