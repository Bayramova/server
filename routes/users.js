"use strict";

/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const Client = require("../models/client");
// const Company = require("../models/company");
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
    const newUser = { ...req.body };

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        return User.create(newUser)
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
          role: user.role,
          iat: 1516234022
        };

        jwt.sign(
          payload,
          jwtSecret.secret,
          {
            expiresIn: 10
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
